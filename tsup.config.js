import { defineConfig } from "tsup";
export default defineConfig({
    entry: ["src/server.ts"],
    format: ["esm"], // Keep this as ESM
    target: "esnext",
    outDir: "dist",
    clean: true,
    bundle: true,
    splitting: false,
    sourcemap: true,
});
//# sourceMappingURL=tsup.config.js.map