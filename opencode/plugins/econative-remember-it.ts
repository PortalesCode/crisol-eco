import { writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";

export default (async () => {
  return {
    tool: {
      econative_remember_it: tool({
        description:
          "Guarda un descubrimiento/recuerdo en Memoria/discoveries/ con fecha, tags e importancia.",
        args: {
          title: tool.schema.string().describe("Título corto del descubrimiento"),
          content: tool.schema.string().describe("Contenido del descubrimiento"),
          tags: tool.schema.string().optional().describe("Tags separados por coma (opcional)"),
          importance: tool.schema.number().optional().describe("Importancia 1-5 (default: 3)"),
        },
        async execute(args, context) {
          const discoveriesDir = join(context.directory, ".opencode", "Memoria", "discoveries");
          if (!existsSync(discoveriesDir)) mkdirSync(discoveriesDir, { recursive: true });

          const date = new Date().toISOString().slice(0, 10);
          const slug = args.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
          const filename = `${date}-${slug}.md`;
          const importance = args.importance ?? 3;

          const md = [
            `# ${args.title}`,
            `**Fecha:** ${date}`,
            `**Importancia:** ${importance}/5`,
            args.tags ? `**Tags:** ${args.tags}` : null,
            "",
            args.content,
          ].filter(Boolean).join("\n");

          writeFileSync(join(discoveriesDir, filename), md, "utf-8");

          return JSON.stringify({ ok: true, file: filename, importance });
        },
      }),
    },
  };
}) satisfies Plugin;
