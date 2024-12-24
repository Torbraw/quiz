import { type Component, For, createSignal, onMount } from "solid-js";
import type { GameHistory, GameOptions, QuestionWithId } from "../lib/types";
import { buildQuestionUrl, useTranslations } from "../lib/utils";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type Props = {
  locale: string;
  questions: QuestionWithId[];
};
export const HistoryTable: Component<Props> = (props) => {
  const locale = () => props.locale;
  const questions = () => props.questions;
  const t = useTranslations(props.locale);
  const [games, setGames] = createSignal<GameOptions[]>([]);

  const categories = (questionIds: string[]) => {
    const set = new Set<string>();
    for (const id of questionIds) {
      const question = questions().find((q) => q.id === id);
      if (question) {
        set.add(t(`categoryEnum.${question.category}`));
      }
    }
    return Array.from(set).join(", ");
  };

  const clearGame = (index: number) => {
    const newGames = games().filter((_, i) => i !== index);
    setGames(newGames);
    try {
      localStorage.setItem("gameHistory", JSON.stringify({ games: newGames }));
    } catch (e) {
      console.error("Error saving game history", e);
    }
  };

  const replayGame = (game: GameOptions) => {
    try {
      localStorage.setItem("gameOptions", JSON.stringify(game));
    } catch (e) {
      console.error("Error saving game options", e);
      return;
    }

    window.location.href = buildQuestionUrl({
      locale: locale(),
      duration: game.timerDuration,
      autoShowAnswer: game.autoShowAnswer,
      showTimer: game.showTimer,
      nextId: game.questionIds[0]!,
      index: 0,
    });
  };

  const clearHistory = () => {
    setGames([]);
    localStorage.removeItem("gameHistory");
  };

  onMount(() => {
    try {
      const history = localStorage.getItem("gameHistory");
      if (history) {
        const parsedHistory = JSON.parse(history) as GameHistory;
        setGames(parsedHistory.games);
      }
    } catch (error) {
      console.error("Failed to load history", error);
    }
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>{t("numberOfQuestions")}</TableHead>
            <TableHead>{t("categories")}</TableHead>
            <TableHead>{t("timerEnabled")}</TableHead>
            <TableHead>{t("timerDuration")}</TableHead>
            <TableHead>{t("autoShowAnswer")}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={games()}>
            {(game, index) => (
              <TableRow>
                <TableCell>{index() + 1}</TableCell>
                <TableCell>{game.questionIds.length}</TableCell>
                <TableCell>{categories(game.questionIds)}</TableCell>
                <TableCell>{game.showTimer ? t("yes") : t("no")}</TableCell>
                <TableCell>{game.showTimer ? game.timerDuration : ""}</TableCell>
                <TableCell>{game.autoShowAnswer ? t("yes") : t("no")}</TableCell>
                <TableCell class="flex gap-4">
                  <Button onClick={() => replayGame(game)}>{t("replayGame")}</Button>
                  <Button variant="destructive" onClick={() => clearGame(index())}>
                    {t("clear")}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
      <Button variant="destructive" disabled={games().length <= 0} onClick={() => clearHistory()}>
        {t("clearHistory")}
      </Button>
    </>
  );
};
