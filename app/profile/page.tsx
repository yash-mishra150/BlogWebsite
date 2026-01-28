"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/api";
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserProfile();
        setProfile(data?.user ?? data);
      } catch (e: any) {
        setError(e.message || "Unauthorized");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="px-8 py-16">
        <p className="text-sm opacity-60">Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-16">
        <p className="text-sm text-red-600 mb-6">{error}</p>
        <Link
          href="/login"
          className="underline underline-offset-4 font-semibold"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-20">
        <Link href="/" className="text-sm font-semibold">
          ← BACK
        </Link>
        <span className="text-xl font-bold tracking-wide">
          MAGAZINE
        </span>
      </div>

      {/* Title */}
      <h1 className="text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-tight mb-12">
        Profile
      </h1>

      <div className="h-px bg-black mb-16" />

      {/* Layout */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-16">
        {/* Left Meta */}
        <aside>
          <h2 className="text-2xl font-bold mb-6">
            {profile.name}
          </h2>

          <div className="space-y-4 text-sm">
            <p>
              <span className="font-semibold block mb-1">
                Email
              </span>
              {profile.email}
            </p>
          </div>
        </aside>

        {/* Right Content */}
        <div className="space-y-8 text-[15px] leading-8">
          <p>
            This profile represents your editorial identity
            within the magazine. Your name may appear as a
            byline on published articles, drafts, or internal
            content depending on your permissions.
          </p>

          <p>
            Profile management is intentionally minimal to
            keep the focus on writing, publishing, and
            curating content rather than account settings.
          </p>

          <div className="pt-12">
            <Link
              href="/"
              className="inline-block border border-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
