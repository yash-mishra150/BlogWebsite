"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { deleteBlog, getBlog, updateBlog } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function BlogDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!getToken()) {
        setError("Login required");
        setLoading(false);
        return;
      }

      try {
        const data = await getBlog(id);
        setBlog(data);
      } catch (e: any) {
        setError(e.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="p-8">Loading…</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!blog) return null;

  return (
    <article className="max-w-7xl mx-auto px-8 py-12">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-20">
        <Link href="/" className="text-sm font-semibold">
          ← GO BACK
        </Link>
        <span className="text-xl font-bold tracking-wide">MAGAZINE</span>
      </div>

      {/* FULL WIDTH TITLE */}
      <h1 className="text-[clamp(3.5rem,7vw,6rem)] font-extrabold leading-[0.95] mb-12">
        {blog.title}
      </h1>

      {/* META ROW */}
      <div className="flex items-center gap-8 text-sm mb-8">
        {blog.author && (
          <span>
            <b>Text</b>{" "}
            <span className="underline underline-offset-4">
              {blog.author}
            </span>
          </span>
        )}
        <span>
          <b>Date</b>{" "}
          {new Date(blog.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {/* HERO IMAGE */}
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full mb-24"
        />
      )}

      {/* BODY */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-16">
        {/* AUTHOR SIDEBAR */}
        <aside>
          {blog.author && (
            <>
              <h3 className="text-2xl font-bold mb-6">
                {blog.author}
              </h3>
              <div className="h-px bg-black mb-6" />
            </>
          )}

          <button
            onClick={() => setOpen(true)}
            className="text-sm font-semibold underline"
          >
            Manage Article
          </button>
        </aside>

        {/* ARTICLE CONTENT */}
        <div className="space-y-8 text-[15px] leading-8">
          {blog.content
            .split("\n\n")
            .map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {open && (
        <EditModal blog={blog} onClose={() => setOpen(false)} />
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* MODAL */
/* ------------------------------------------------------------------ */

function EditModal({
  blog,
  onClose,
}: {
  blog: any;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onUpdate = async () => {
    setLoading(true);
    await updateBlog(blog._id, title, content);
    router.refresh();
    onClose();
  };

  const onDelete = async () => {
    setLoading(true);
    await deleteBlog(blog._id);
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl border border-black p-6">
        <h2 className="text-xl font-bold mb-4">
          Manage Article
        </h2>

        <div className="space-y-3">
          <input
            className="w-full border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border px-3 py-2 min-h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onDelete}
            disabled={loading}
            className="text-red-600 font-semibold"
          >
            Delete
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border"
            >
              Cancel
            </button>
            <button
              onClick={onUpdate}
              disabled={loading}
              className="px-4 py-2 bg-black text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
