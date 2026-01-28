"use client";
import { useState } from 'react';
import { createBlog } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
      setError(e.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Create Blog</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <div>
          <label className="block text-sm">Title</label>
          <input className="border px-2 py-1 rounded w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Content</label>
          <textarea className="border px-2 py-1 rounded w-full min-h-40" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0])} />
        </div>
        <button disabled={loading} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50">Create</button>
      </form>
    </div>
  );
}
