/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Static export for GitHub Pages deployment */
  output: "export",

  /*
   * GitHub Pages serves from /<repo-name>/ by default.
   * Set basePath and assetPrefix to the repository name.
   * Adjust if deploying to a custom domain (remove both).
   */
  basePath: "/scroll-hero-animation",
  assetPrefix: "/scroll-hero-animation/",

  /* Expose basePath as an env var so components can reference assets */
  env: {
    NEXT_PUBLIC_BASE_PATH: "/scroll-hero-animation",
  },

  /* next/image is not supported in static export — use unoptimized */
  images: {
    unoptimized: true,
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
