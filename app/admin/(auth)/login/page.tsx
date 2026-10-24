"use client";

import Image from "next/image";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminProviders } from "@/components/admin/Providers";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-4 rounded-xl border border-ink/10 bg-white p-8 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-ink/10">
          <Image
            src="/logos/atpa.jpg"
            alt="ATPA"
            fill
            className="object-cover"
            sizes="48px"
            priority
          />
        </span>
        <div>
          <h1 className="font-display text-2xl text-ink">ATPA Admin</h1>
          <p className="mt-0.5 text-sm text-muted">
            Sign in to manage tournaments
          </p>
        </div>
      </div>
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-ink/15 px-3 py-2.5 outline-none focus:border-leaf"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-ink/15 px-3 py-2.5 outline-none focus:border-leaf"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="pt-1 text-center text-xs text-muted">
        Powered by{" "}
        <a
          href="https://editcomedia.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          editcomedia.com
        </a>
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <AdminProviders>
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </AdminProviders>
  );
}
