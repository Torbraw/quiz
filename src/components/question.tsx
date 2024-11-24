import { type Component, Match, Show, Switch, createSignal, onMount } from "solid-js";
import type { Question as QuestionType } from "../content.config";
import type { GameOptions } from "../lib/types";
import { InfoIcon, TagIcon } from "./common/icons";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
  question: QuestionType;
};
export const Question: Component<Props> = (props) => {
  const question = props.question;
  const [duration, setDuration] = createSignal(0);
  const [showTimer, setShowTimer] = createSignal(false);
  const [autoShowAnswer, setAutoShowAnswer] = createSignal(false);
  const [questionCount, setQuestionCount] = createSignal(0);
  const [nextId, setNextId] = createSignal<string>();
  const [showHint, setShowHint] = createSignal(false);

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const auto = params.get("sa") ?? "true";
    setAutoShowAnswer(auto === "true");

    const time = params.get("td") ?? "60";
    setDuration(+time);

    const show = params.get("st") ?? "true";
    setShowTimer(show === "true");

    const count = params.get("c") ?? "10";
    setQuestionCount(+count);

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

    console.log({
      autoShowAnswer: autoShowAnswer(),
      duration: duration(),
      showTimer: showTimer(),
      questionCount: questionCount(),
      nextId: nextId(),
    });
  });

  return (
    <div class="flex flex-col gap-8">
      <div class="flex items-center flex-col gap-3">
        <Badge variant="secondary" class="flex flex-row gap-2 items-center py-1.5 px-3.5 hover:bg-secondary">
          <TagIcon class="w-6 h-6" />
          <span class="font-semibold text-xl">{question.category}</span>
        </Badge>
        <Show when={question.hint}>
          <div class="flex flex-row gap-2 items-center h-8">
            <Show
              when={showHint()}
              fallback={
                <Button class="gap-2" variant="ghost" size="sm" onClick={() => setShowHint(true)}>
                  <InfoIcon class="w-6 h-6" /> Show Hint
                </Button>
              }
            >
              <InfoIcon class="w-6 h-6" />
              <h3 class="text-sm font-semibold">{question.hint}</h3>
            </Show>
          </div>
        </Show>
      </div>
      <div class="flex flex-col gap-4 rounded-xl border bg-card p-6 items-center text-card-foreground shadow text-xl max-w-6xl min-w-[30dvw]">
        <p>{question.question}</p>
        <Show when={question.mediaUrl && question.mediaType}>
          <Switch>
            <Match when={question.mediaType === "image"}>
              <img src={question.mediaUrl} alt={question.answer} class="max-h-[50dvh]" />
            </Match>
            <Match when={question.mediaType!.startsWith("audio")}>
              <audio controls>
                <source src={question.mediaUrl} type={question.mediaType} />
                <track kind="captions" />
              </audio>
            </Match>
            <Match when={question.mediaType!.startsWith("video")}>
              <video controls class="max-h-[50dvh]">
                <source src={question.mediaUrl} type={question.mediaType} />
                <track kind="captions" />
              </video>
            </Match>
          </Switch>
        </Show>
      </div>
    </div>
  );
};
