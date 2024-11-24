import { type Component, createSignal, onMount } from "solid-js";
import type { Question as QuestionType } from "../content.config";
import type { GameOptions } from "../lib/types";
import { TagIcon } from "./common/icons";
import { Badge } from "./ui/badge";

type Props = {
  question: QuestionType;
};
export const Question: Component<Props> = (props) => {
  const [duration, setDuration] = createSignal(0);
  const [showTimer, setShowTimer] = createSignal(false);
  const [autoShowAnswer, setAutoShowAnswer] = createSignal(false);
  const [nextId, setNextId] = createSignal<string>();

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const auto = params.get("sa") ?? "true";
    setAutoShowAnswer(auto === "true");

    const time = params.get("td") ?? "0";
    setDuration(+time);

    const show = params.get("st") ?? "true";
    setShowTimer(show === "true");

    const index = +(params.get("i") ?? "0");

    const gameOptions = localStorage.getItem("gameOptions");
    if (gameOptions) {
      try {
        const options = JSON.parse(gameOptions) as GameOptions;
        const next = options.questionIds[index + 1];
        setNextId(next);
      } catch (e) {
        console.error("Error parsing game options", e);
      }
    }
  });

  return (
    <div class="flex flex-col gap-8">
      duration: {duration()} showTimer: {showTimer().toString()}
      sa: {autoShowAnswer().toString()} id: {nextId()}
      <div class="flex justify-center">
        <Badge variant="secondary" class="flex flex-row gap-2 items-center py-1.5 px-3.5 hover:bg-secondary">
          <TagIcon class="w-6 h-6" />
          <span class="font-semibold text-xl">{props.question.category}</span>
        </Badge>
      </div>
      <div class="flex flex-col gap-2 rounded-xl border bg-card p-6 text-center text-card-foreground shadow text-xl max-w-7xl">
        {props.question.question}
      </div>
    </div>
  );
};
