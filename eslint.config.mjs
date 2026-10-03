import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}", "scripts/**/*.{ts,mjs}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: ["**/tests/**", "tests/**"], message: "Data bersama berada di src/demo; aplikasi dan script tidak mengimpor dari tests." }],
      }],
    },
  },
  globalIgnores([".next/**", "next-env.d.ts", ".agents/**", "docs/archive/**", "playwright-report/**", "test-results/**"]),
]);
