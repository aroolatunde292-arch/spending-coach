import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Spending Coach",
    short_name: "Spending Coach",
    description:
      "Plan your spending, protect what matters, and make your money last.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F8FAF7",
    theme_color: "#173F32",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}