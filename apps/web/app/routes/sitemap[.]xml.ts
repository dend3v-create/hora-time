import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  // Support canonical domain while dynamically adapting if tested on preview/staging domains
  const baseUrl = url.origin.includes("localhost") || url.origin.includes("pages.dev")
    ? url.origin
    : "https://phopephum.com";

  const pages = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/features", changefreq: "weekly", priority: "0.9" },
    { loc: "/pricing", changefreq: "weekly", priority: "0.9" },
    { loc: "/how-it-works", changefreq: "weekly", priority: "0.8" },
    { loc: "/faq", changefreq: "weekly", priority: "0.8" },
    { loc: "/security", changefreq: "monthly", priority: "0.7" },
    { loc: "/register", changefreq: "monthly", priority: "0.7" },
    { loc: "/login", changefreq: "monthly", priority: "0.6" },
    { loc: "/terms", changefreq: "monthly", priority: "0.5" },
    { loc: "/privacy", changefreq: "monthly", priority: "0.5" },
    { loc: "/refund", changefreq: "monthly", priority: "0.5" },
  ];

  const today = new Date().toISOString().split("T")[0];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemapXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
