import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content_layer",
  loader: glob({ pattern: "**/*.md", base: "./src/posts" }),
  schema: ({ image }) =>
    z.object({
      // author: z.string().default(SITE.author),
      date: z.coerce.date(),
      // modDatetime: z.date().optional().nullable(),
      title: z.string(),
      // featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      tags: z.array(z.string()).default(["others"]),
      // ogImage: image()
      //   .refine(img => img.width >= 1200 && img.height >= 630, {
      //     message: "OpenGraph image must be at least 1200 X 630 pixels!",
      //   })
      //   .or(z.string())
      //   .optional(),
      description: z.string().optional(),
      // canonicalURL: z.string().optional(),
      // editPost: z
      //   .object({
      //     disabled: z.boolean().optional(),
      //     url: z.string().optional(),
      //     text: z.string().optional(),
      //     appendFilePath: z.boolean().optional(),
      //   })
      //   .optional(),
    }),
});

export const collections = { blog };
