import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const CATEGORIES = z.enum([
  "general",
  "blind-test",
  "movies",
  "cartoons",
  "celebrities-qc",
  "celebrities",
  "math",
  "logo",
  "rebus",
  "translated-lyrics-fr",
  "translated-lyrics-en",
  "spelling",
  "animals",
  "video-games",
  "four-pics-one-word",
]);

const MEDIA_TYPES = z.enum(["image", "video", "audio"]);

const questionSchema = z.object({
  question: z.string().max(200),
  category: CATEGORIES,
  answer: z.string().max(500),
  difficulty: z.number().min(1).max(3),
  mediaUrl: z.string().optional(),
  mediaType: MEDIA_TYPES.optional(),
  hint: z.string().max(200).optional(),
});

export type Question = z.infer<typeof questionSchema>;

const questions = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/questions" }),
  schema: questionSchema,
});

export const collections = { questions };
