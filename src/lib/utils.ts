import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
