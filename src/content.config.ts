import { defineCollection , z } from "astro:content";
import { glob } from "astro/loaders";

const category = z.enum(["general"])

const mediaType = z.enum([
  "image",
  "video",
  "audio"
])

const questions = defineCollection({
  loader: glob({ pattern: "**\/*.json", base: "./src/content/questions" }),
  schema: z.object({
    question: z.string().max(200),
    category: category,
    answer: z.string().max(500),
    difficulty: z.number().min(1).max(3),
    mediaUrl: z.string().optional(),
    mediaType: mediaType.optional(),
    hint: z.string().max(200).optional(),
  }),
});

export const collections = {questions};
