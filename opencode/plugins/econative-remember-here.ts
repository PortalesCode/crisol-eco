import { readFileSync, readdirSync, existsSync } from "fs";
import { join, extname } from "path";
import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";

export default (async () => {
  return {
    tool: {
      econative_remember_here: tool({
        description:
          "Lee descubrimientos guardados en Memoria/discoveries/. Opcionalmente filtra por tag o importancia mínima.",
        args: {
          tag: tool.schema.string().optional().describe("Filtrar por tag"),
          min_importance: tool.schema.number().optional().describe("Importancia mínima (1-5)"),
          limit: tool.schema.number().optional().describe("Máx resultados (default: 10)"),
        },
        async execute(args, context) {
          const discoveriesDir = join(context.directory, ".opencode", "Memoria", "discoveries");

          if (!existsSync(discoveriesDir)) {
            return JSON.stringify({ ok: true, count: 0, discoveries: [] });
          }

          const limit = args.limit ?? 10;
          let files = readdirSync(discoveriesDir)
            .filter((f) => extname(f) === ".md")
            .sort().reverse()
            .slice(0, limit);

          const discoveries = files.map((f) => {
            const content = readFileSync(join(discoveriesDir, f), "utf-8");
            const lines = content.split("\n");
            const title = lines[0]?.replace(/^#\s*/, "") || f;
            const importance = lines[2]?.match(/Importancia:\s*(\d)/)?.[1]
              ? parseInt(lines[2].match(/Importancia:\s*(\d)/)![1])
              : 0;
            const tags = lines[3]?.match(/Tags:\s*(.+)/)?.[1]?.split(",").map((t) => t.trim()) || [];
            return { file: f, title, importance, tags, preview: content.slice(0, 500) };
          });

          // Filter by tag if provided
          const filtered = args.tag
            ? discoveries.filter((d) => d.tags.some((t) => t.toLowerCase().includes(args.tag!.toLowerCase())))
            : discoveries;

          // Filter by min importance if provided
          const final = args.min_importance
            ? filtered.filter((d) => d.importance >= args.min_importance!)
            : filtered;

          return JSON.stringify({ ok: true, count: final.length, discoveries: final });
        },
      }),
    },
  };
}) satisfies Plugin;
