"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [authed, setAuthed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const path = usePathname();

  useEffect(() => {
    const checkAuth = () => setAuthed(!!getToken());
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  if (path == "/login" || path == "/register") {
    return null;
  }

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
    router.push("/");
  };

  return (
    <header className="border-b px-4 sm:px-8 lg:px-12 mt-6 bg-background/50 backdrop-blur">
      <nav className="mx-auto max-w-7xl py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-2xl sm:text-3xl">
          BlogSite
        </Link>
        
        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation"
          className="sm:hidden inline-flex items-center justify-center p-2 rounded border border-black/20"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
          {authed ? (
            <>
              <Link href="/create" className="hover:underline">
                Create
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-black text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="flex flex-col gap-3">
            <Link href="/" className="hover:underline" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/profile" className="hover:underline" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            {authed ? (
              <>
                <Link href="/create" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Create
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded bg-black text-white w-fit"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
