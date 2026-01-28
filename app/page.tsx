"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBlogs } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Blog = {
  _id: string;
  title: string;
  author?: string;
  content: string;
  date?: string;
  imageUrl?: string | null;
};

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBlogs({
        page,
        size,
        title: title || undefined,
        author: author || undefined,
      });
      setBlogs(data.blogs ?? []);
    } catch (e: any) {
      setError(e.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // Require auth: redirect if no token
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthed(true);
  }, [router]);

  // Load blogs when authed and paging changes
  useEffect(() => {
    if (authed) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, page, size]);

  const featuredBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  // if (loading)
  //   return (
  //     <div className="max-w-7xl mx-auto py-20 text-center">
  //       <p className="text-xl">Loading…</p>
  //     </div>
  //   );
  if (error)
    return (
      <div className="max-w-7xl mx-auto py-20">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );

  return (
    <div>
      <div className="px-[2vw] mx-auto">
  <h1
    className="
      font-black
      tracking-tight
      leading-[0.85]
      text-center
      text-[clamp(4rem,19vw,18rem)]
      whitespace-normal
      sm:whitespace-nowrap
    "
  >
    ART&nbsp;&amp;<wbr />&nbsp;LIFE
  </h1>
</div>


      <div className="px-[2.5vw] mt-8">
        <div className="bg-black text-white h-16 flex items-center overflow-hidden">
          <div className="shrink-0 px-8 font-bold text-sm whitespace-nowrap">
            NEWS TICKER+++
          </div>

          {/* RIGHT: SCROLLING AREA */}
          <div className="relative flex-1 overflow-hidden">
            <div className="ticker-content flex whitespace-nowrap">
              <span className="px-6 text-sm">
                sit amet, consectetur adipiscing elit +++
              </span>
              <span className="px-6 text-sm">
                Lorem ipsum dolor sit amet +++
              </span>
              <span className="px-6 text-sm">
                consectetur adipiscing elit +++
              </span>

              {/* DUPLICATE for seamless loop */}
              <span className="px-6 text-sm">
                sit amet, consectetur adipiscing elit +++
              </span>
              <span className="px-6 text-sm">
                Lorem ipsum dolor sit amet +++
              </span>
              <span className="px-6 text-sm">
                consectetur adipiscing elit +++
              </span>
            </div>
          </div>
        </div>
      </div>

      {featuredBlog && (
        <div className="mx-auto px-8 py-16">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <Link href={`/blog/${featuredBlog._id}`}>
                <h2 className="text-6xl md:text-7xl font-black leading-[0.95] tracking-tight hover:opacity-70 transition">
                  {featuredBlog.title.toUpperCase()}
                </h2>
              </Link>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                {featuredBlog.content.substring(0, 300)}…
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <span className="font-semibold">Text</span>{" "}
                  <span className="underline">
                    {featuredBlog.author || "Anonymous"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Date</span>{" "}
                  {new Date(
                    featuredBlog.date || Date.now(),
                  ).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Read</span> 5 Min
                </div>

                <Link
                  href={`/blog/${featuredBlog._id}`}
                  className="px-5 py-2 border border-black rounded-full text-xs font-semibold hover:bg-black hover:text-white transition"
                >
                  READ
                </Link>
              </div>
            </div>
          </div>

          {featuredBlog.imageUrl && (
            <div className="mt-12">
              <img
                src={featuredBlog.imageUrl}
                alt={featuredBlog.title}
                className="w-full h-120 object-cover"
              />
            </div>
          )}
        </div>
      )}

      <div className="mx-auto px-8 py-8 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(0);
            load();
          }}
          className="
      grid
      grid-cols-1
      gap-4
      md:grid-cols-4
      items-end
    "
        >
          {/* Title */}
          <div className="w-full">
            <label className="block text-xs font-semibold mb-1">
              FILTER BY TITLE
            </label>
            <input
              className="border border-black px-3 py-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Search..."
            />
          </div>

          {/* Author */}
          <div className="w-full">
            <label className="block text-xs font-semibold mb-1">
              FILTER BY AUTHOR
            </label>
            <input
              className="border border-black px-3 py-2 w-full"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name..."
            />
          </div>

          {/* Per Page */}
          <div className="w-full">
            <label className="block text-xs font-semibold mb-1">PER PAGE</label>
            <input
              type="number"
              min={1}
              max={50}
              className="border border-black px-3 py-2 w-full"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
        w-full
        px-6
        py-2.75
        bg-black
        text-white
        font-semibold
        text-sm
        hover:opacity-80
        transition
      "
          >
            APPLY
          </button>
        </form>
      </div>

      <div className="mx-auto px-8 py-12">
        {!loading && otherBlogs.length === 0 && (
          <p className="text-center text-lg">No more blogs found.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {otherBlogs.map((b) => (
            <Link
              key={b._id}
              href={`/blog/${b._id}`}
              className="group flex flex-col border border-black p-6"
            >
              {/* Date */}
              <div className="mb-6 text-sm text-gray-700">
                {new Date(featuredBlog.date || Date.now()).toLocaleDateString()}
              </div>

              {/* Image */}
              {b.imageUrl && (
                <div className="overflow-hidden mb-6">
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Title */}
              <h3 className="text-2xl font-bold mb-3 leading-snug">
                {b.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-700 mb-10 line-clamp-4">
                {b.content}
              </p>

              {/* Footer */}
              {b.author && (
                <div className="mt-auto text-sm">
                  <span className="font-semibold">Text </span>
                  <span className="underline underline-offset-4">
                    {b.author}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-6 border border-black px-6 py-3">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="
        text-sm
        font-semibold
        disabled:opacity-40
        hover:opacity-70
        transition
      "
          >
            ← Prev
          </button>

          <span className="text-sm font-medium">Page {page + 1}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="
        text-sm
        font-semibold
        hover:opacity-70
        transition
      "
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
