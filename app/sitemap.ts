import type { MetadataRoute } from "next";
import { projects } from "./projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `https://automateiv.vercel.app/work/${project.slug}`,
    lastModified: new Date("2026-08-30"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://automateiv.vercel.app/",
      lastModified: new Date("2026-08-30"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies,
  ];
}
