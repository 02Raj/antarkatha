import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/supabase/admin",
              importNames: ["createAdminClient"],
              message: "Service-role client is server-only. Import it only from server modules.",
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/lib/**/*.server.ts",
      "src/server/**/*.ts",
      "src/app/**/route.ts",
      "src/app/**/actions.ts",
    ],
    rules: { "no-restricted-imports": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    "src/types/database.types.ts",
  ]),
]);

export default eslintConfig;
