import type { MetadataRoute } from "next";
import { projects } from "./projects";
import { SITE_CONFIG } from "./site-config";

const CONTENT_UPDATED_AT = new Date("2026-08-31");

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_CONFIG.url}/work/${project.slug}`,
    lastModified: CONTENT_UPDATED_AT,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_CONFIG.url}/`,
      lastModified: CONTENT_UPDATED_AT,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/about`,
    },
    ...caseStudies,
  ];
}
