import { signOut } from "@/lib/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/admin/login" });
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink hover:bg-canvas"
      >
        Sign out
      </button>
    </form>
  );
}
