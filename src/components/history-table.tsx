import { type Component, For, createSignal, onMount } from "solid-js";
import type { GameHistory, GameOptions } from "../lib/types";
import { buildQuestionUrl, useTranslations } from "../lib/utils";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type Props = {
  locale: string;
};
export const HistoryTable: Component<Props> = (props) => {
  const locale = () => props.locale;
  const t = useTranslations(props.locale);
  const [games, setGames] = createSignal<GameOptions[]>([]);

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
                <TableCell>{game.showTimer ? t("yes") : t("no")}</TableCell>
                <TableCell>{game.showTimer ? game.timerDuration : ""}</TableCell>
                <TableCell>{game.autoShowAnswer ? t("yes") : t("no")}</TableCell>
                <TableCell>
                  <Button onClick={() => replayGame(game)}>{t("replayGame")}</Button>
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
      <Button disabled={games().length <= 0} onClick={() => clearHistory()}>
        {t("clearHistory")}
      </Button>
    </>
  );
};
