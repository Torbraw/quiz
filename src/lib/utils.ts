import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { defaultLang, ui } from "./ui";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fisherYatesShuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
};

export const buildQuestionUrl = (params: {
  duration: number;
  autoShowAnswer: boolean;
  showTimer: boolean;
  nextId: string;
  index: number;
}) => {
  const url = new URL(`questions/${params.nextId}`, window.location.origin);
  url.searchParams.set("td", params.duration.toString());
  url.searchParams.set("sa", params.autoShowAnswer.toString());
  url.searchParams.set("st", params.showTimer.toString());
  url.searchParams.set("i", params.index.toString());
  return url.toString();
};

export function useTranslations(lang: string) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang as keyof typeof ui][key] || ui[defaultLang][key];
  };
}

export async function getQuestionMediaSrc(
  questionMediaSrc: string | undefined,
  medias: Record<
    string,
    () => Promise<{
      default: ImageMetadata | string;
    }>
  >,
) {
  let mediaSrc: string | undefined = undefined;
  if (questionMediaSrc) {
    const media = medias[questionMediaSrc];
    if (media) {
      const unwrappedMedia = await media();
      if (typeof unwrappedMedia.default === "string") {
        mediaSrc = unwrappedMedia.default;
      } else {
        mediaSrc = unwrappedMedia.default.src;
      }
    }
  }
  return mediaSrc;
}
