import { after, NextResponse } from "next/server";
import { createRegistration } from "@/lib/registrations/create";
import { deliverEmailJobs, processEmailQueue } from "@/lib/email-queue";
import { rateLimit } from "@/lib/rate-limit";
import { ZodError } from "zod";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limited = rateLimit(`reg:${ip}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      },
    );
  }

  try {
    const body = await request.json();
    const result = await createRegistration(body);

    const jobIds = result.emailJobIds || [];
    // Send after the client already got their registration ID
    after(async () => {
      try {
        if (jobIds.length) {
          await deliverEmailJobs(jobIds);
        }
        // Opportunistically drain any other stuck queued mails
        await processEmailQueue({ limit: 10 });
      } catch (err) {
        console.error("[email-queue] background delivery failed", err);
      }
    });

    return NextResponse.json(
      {
        registrationId: result.registrationId,
        successMessage: result.successMessage,
        duplicate: result.duplicate,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid registration data", details: err.flatten() },
        { status: 400 },
      );
    }
    const status = (err as { status?: number }).status || 500;
    const message =
      err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status });
  }
}
