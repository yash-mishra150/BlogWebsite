"use client";

import { useState } from "react";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await register(name, email, password);
      setMessage(data?.message || "Registered successfully");
      setTimeout(() => router.push("/login"), 1200);
    } catch (e: any) {
      setError(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-sm font-bold tracking-wide mb-12">MAGAZINE</div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold leading-tight mb-8">REGISTER</h1>

        <div className="h-px bg-black mb-8" />

        {/* Messages */}
        {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

        {message && <p className="text-sm text-green-600 mb-6">{message}</p>}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide">
              NAME
            </label>
            <input
              required
              className="w-full border-b border-black py-2 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide">
              EMAIL
            </label>
            <input
              type="email"
              required
              className="w-full border-b border-black py-2 outline-none"
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
            {loading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-8 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
