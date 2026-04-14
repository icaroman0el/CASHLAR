import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cashlar",
    short_name: "Cashlar",
    description: "Controle financeiro pessoal com Supabase e experiencia mobile.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe7",
    theme_color: "#d39c3f",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
