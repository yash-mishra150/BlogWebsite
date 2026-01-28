"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      if (data?.token) setToken(data.token);
      router.push("/profile");
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-sm font-bold tracking-wide mb-12">
          MAGAZINE
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold leading-tight mb-8">
          LOGIN
        </h1>

        <div className="h-px bg-black mb-8" />

        {error && (
          <p className="text-sm text-red-600 mb-6">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide">
              EMAIL
            </label>
            <input
              type="email"
              required
              className="w-full border-b border-black py-2 outline-none focus:border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide">
              PASSWORD
            </label>
            <input
              type="password"
              required
              className="w-full border-b border-black py-2 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="mt-10 w-full border border-black py-3 font-semibold hover:bg-black hover:text-white transition disabled:opacity-50"
          >
            {loading ? "LOGGING IN…" : "SIGN IN"}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-8 text-sm">
          Don’t have access?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Get now
          </Link>
        </p>
      </div>
    </section>
  );
}
