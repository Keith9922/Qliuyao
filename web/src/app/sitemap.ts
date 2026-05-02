import type { MetadataRoute } from "next";
import { listAllHexagrams } from "@/lib/hexagrams";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://qliuyao.vercel.app";
  const now = new Date();
  const staticPages = ["", "/quantum", "/about", "/disclaimer", "/index-64"];

  const list: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  for (const { binary } of listAllHexagrams()) {
    list.push({
      url: `${base}/index-64/${binary}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  return list;
}
