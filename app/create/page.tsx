"use client";

import { useState } from "react";
import { createBlog } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await createBlog(title, content, image);
      if (data?.id) router.push(`/blog/${data.id}`);
    } catch (e: any) {
      setError(e.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-20">
        <Link href="/" className="text-sm font-semibold">
          ← BACK
        </Link>
        <span className="text-xl font-bold tracking-wide">MAGAZINE</span>
      </div>

      {/* Title */}
      <h1 className="text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-tight mb-12">
        New Article
      </h1>

      <div className="h-px bg-black mb-16" />

      {/* Layout */}
      <form
        onSubmit={onSubmit}
        className="grid lg:grid-cols-[280px_1fr] gap-16"
      >
        {/* Left Meta */}
        <aside>
          <p className="text-sm leading-relaxed opacity-70">
            Create a new editorial entry for the magazine. Titles should be
            concise and typographically strong. Content supports basic paragraph
            formatting.
          </p>
        </aside>

        {/* Right Form */}
        <div className="space-y-12">
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold tracking-wide mb-3">
              TITLE
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-black py-3 text-xl outline-none"
              placeholder="Article title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold tracking-wide mb-3">
              CONTENT
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[320px] border border-black p-4 text-[15px] leading-8 outline-none"
              placeholder="Write the article content here…"
            />
          </div>

          {/* Image */}
          {/* Feature Image */}
          <div>
            <label className="block text-xs font-semibold tracking-wide mb-3">
              FEATURE IMAGE
            </label>

            <div className="space-y-6">
              {/* Preview */}
              {image && (
                <div className="border border-black p-3 max-w-xl">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full object-cover"
                  />
                  <p className="text-xs mt-2 opacity-60">
                    Preview · {image.name}
                  </p>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-6">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0])}
                  className="hidden"
                />

                <label
                  htmlFor="image-upload"
                  className="
          inline-flex
          items-center
          justify-center
          border
          border-black
          px-6
          py-3
          font-semibold
          cursor-pointer
          hover:bg-black
          hover:text-white
          transition
        "
                >
                  {image ? "REPLACE IMAGE" : "CHOOSE IMAGE"}
                </label>

                {image && (
                  <button
                    type="button"
                    onClick={() => setImage(undefined)}
                    className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Helper */}
              <p className="text-xs opacity-60">
                Recommended: landscape · JPG or PNG · Max 5MB
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-8">
            <button
              disabled={loading}
              className="border border-black px-8 py-4 font-semibold hover:bg-black hover:text-white transition disabled:opacity-50"
            >
              {loading ? "PUBLISHING…" : "PUBLISH ARTICLE"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
