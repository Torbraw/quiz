import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

export const CATEGORIES = z.enum([
  "general",
  "blind-test",
  "movies",
  "cartoons",
  "celebrities-qc",
  "celebrities",
  "logo",
  "rebus",
  "translated-lyrics-fr",
  "translated-lyrics-en",
  "spelling",
  "animals",
  "video-games",
  "four-pics-one-word",
  "for-kids",
  "monuments",
  "space",
  "history",
  "flags",
  "complete-the-sentence",
]);

const MEDIA_TYPES = z.enum(["audio/mp3", "audio/wav", "video/mp4", "image"]);

const questionSchema = z.object({
  question: z.string().max(200),
  category: CATEGORIES,
  answer: z.string().max(500),
  difficulty: z.number().min(1).max(3),
  mediaSrc: z.string().optional(),
  mediaType: MEDIA_TYPES.optional(),
  hint: z.string().max(200).optional(),
});

export type Question = z.infer<typeof questionSchema>;

const questionsFr = defineCollection({
  loader: file("./src/content/questions/fr/questions.json"),
  schema: questionSchema,
});

const questionsEn = defineCollection({
  loader: file("./src/content/questions/en/questions.json"),
  schema: questionSchema,
});

export const collections = { questionsFr, questionsEn };
