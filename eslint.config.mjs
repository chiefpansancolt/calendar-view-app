import coreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...coreWebVitals,
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "public/",
      "*.config.js",
      "*.config.mjs",
      ".flowbite-react/",
      "dist/",
      "src/types/validator.ts",
      "src/types/routes.d.ts",
    ],
  },
];

export default config;
