```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/scroll-hero-animation",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* Static export for GitHub Pages deployment */
//   output: "export",
 
//   /* Allow the local browser preview to connect to Next's dev HMR endpoint. */
//   allowedDevOrigins: ["127.0.0.1", "localhost"],

//   /*
//    * GitHub Pages serves from /<repo-name>/ by default.
//    * Set basePath and assetPrefix to the repository name.
//    * Adjust if deploying to a custom domain (remove both).
//    */
//   basePath: "/scroll-hero-animation",
//   assetPrefix: "/scroll-hero-animation/",

//   /* Expose basePath as an env var so components can reference assets */
//   env: {
//     NEXT_PUBLIC_BASE_PATH: "/scroll-hero-animation",
//   },

//   /* next/image is not supported in static export — use unoptimized */
//   images: {
//     unoptimized: true,
//   },

//   turbopack: {
//     rules: {
//       "*.css": {
//         loaders: ["@tailwindcss/turbopack"],
//         as: "*.css",
//       },
//     },
//   },
// };

// export default nextConfig;
