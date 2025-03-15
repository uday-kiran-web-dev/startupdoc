import { auth, signOut, signIn } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = async () => {
  const session = await auth();

  const handleLogout = async () => {
    "use server";
    // Clear session storage and local storage
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
    }
    await signOut({ redirectTo: "/" });
  };

  return (
    <header className="font-work-sans px-5 py-3 bg-cyan-950 shadow-sm text-white">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">Create</Link>

              <form action={handleLogout}>
                <button type="submit">
                  <span className="max-sm:hidden">Logout</span>
                </button>
              </form>

              <Link href={`/user/${session?.user?.id}`}>
                <span>{session?.user?.name}</span>
              </Link>
            </>
          ) : (
            <>
              <form
                action={async () => {
                  "use server";
                  // Trigger GitHub OAuth with prompt=login to ensure re-authentication
                  await signIn("github", { prompt: "login" });
                }}
              >
                <button type="submit">Sign In with GitHub</button>
              </form>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
