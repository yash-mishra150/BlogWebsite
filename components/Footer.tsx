"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const path = usePathname();

  if (path == "/login" || path == "/register") {
    return null;
  }
  return (
    <footer className="bg-black text-white mt-32">
      {/* MARQUEE STRIP */}
      <div className="border-b border-white overflow-hidden whitespace-nowrap">
        <div className="ticker-content flex whitespace-nowrap">
          <span className="px-6 text-sm">NEWSLETTER +++</span>
          <span className="px-6 text-sm">NEWSLETTER +++</span>
          <span className="px-6 text-sm">NEWSLETTER +++</span>

          {/* DUPLICATE for seamless loop */}
          <span className="px-6 text-sm">NEWSLETTER +++</span>
          <span className="px-6 text-sm">NEWSLETTER +++</span>
          <span className="px-6 text-sm">NEWSLETTER +++</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT */}
          <div>
            <h2 className="text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-tight mb-12">
              DESIGN NEWS TO
              <br />
              YOUR INBOX
            </h2>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            <FooterColumn title="Art" items={["Sculptures", "Street Art"]} />
            <FooterColumn title="Magazine" items={["Podcast", "Authors"]} />
            <FooterColumn
              title="Styleguide"
              items={["Licensing", "Changelog"]}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------- */
/* COLUMN */
/* -------------------------------------------- */

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="h-px bg-white mb-4" />
      <p className="mb-4">{title}</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="opacity-80 hover:opacity-100 cursor-pointer"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
