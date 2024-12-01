import type { Question } from "../content.config";

export type QuestionWithId = Question & { id: string };

export type GameOptions = {
  showTimer: boolean;
  timerDuration: number;
  autoShowAnswer: boolean;
  questionIds: string[];
};

export type GameHistory = {
  games: GameOptions[];
};
