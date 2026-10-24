import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-3">
          <p className="text-sm text-muted">Association operations</p>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="font-medium text-ink">{session.user.name}</p>
              <p className="text-xs text-muted">
                {session.user.role.replaceAll("_", " ")}
              </p>
            </div>
            <SignOutButton />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">{children}</div>
        <footer className="border-t border-ink/10 bg-white px-6 py-3 text-center text-xs text-muted">
          Powered by{" "}
          <a
            href="https://editcomedia.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            editcomedia.com
          </a>
        </footer>
      </div>
    </div>
  );
}
