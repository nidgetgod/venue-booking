import type { MetadataRoute } from "next";
import { APP_METADATA } from "@/config/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_METADATA.title,
    short_name: APP_METADATA.shortName,
    description: APP_METADATA.description,
    start_url: "/",
    display: "standalone",
    background_color: APP_METADATA.backgroundColor,
    theme_color: APP_METADATA.themeColor,
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
