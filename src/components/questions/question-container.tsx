import { type Component, Show, createSignal, onMount } from "solid-js";
import type { Question as QuestionType } from "../../content.config";
import type { GameOptions } from "../../lib/types";
import { buildQuestionUrl } from "../../lib/utils";
import {} from "../common/icons";
import { Timer } from "../common/timer";
import { buttonVariants } from "../ui/button";
import { Information } from "./information";
import { Question } from "./question";

type Props = {
  question: QuestionType;
};
export const QuestionContainer: Component<Props> = (props) => {
  const question = props.question;

  const [showTimer, setShowTimer] = createSignal(false);
  const [duration, setDuration] = createSignal(0);
  const [questionCount, setQuestionCount] = createSignal(0);
  const [questionIndex, setQuestionIndex] = createSignal(0);
  const [nextId, setNextId] = createSignal<string>();
  const [autoShowAnswer, setAutoShowAnswer] = createSignal(false);
  const [showAnswer, setShowAnswer] = createSignal(false);

  const onTimerEnd = () => {
    setShowAnswer(true);
  };

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const showAnswer = (params.get("sa") ?? "true") === "true";
    setAutoShowAnswer(showAnswer);

    const count = +(params.get("c") ?? "10");
    setQuestionCount(count);

    const timerDuration = params.get("td") ?? "60";
    setDuration(+timerDuration);

    const show = (params.get("st") ?? "true") === "true";
    setShowTimer(show);

    const index = +(params.get("i") ?? "0");
    setQuestionIndex(index);

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
      <Show when={showTimer()}>
        <div class="flex justify-center">
          <Timer duration={duration()} onEnd={() => onTimerEnd()} />
        </div>
      </Show>
      <Information question={question} />
      <Question question={question} />

      <Show when={nextId() && showAnswer()}>
        <a
          aria-label="next question"
          classList={{
            [buttonVariants({ variant: "link" })]: true,
          }}
          href={buildQuestionUrl({
            questionCount: questionCount(),
            duration: duration(),
            autoShowAnswer: autoShowAnswer(),
            showTimer: showTimer(),
            nextId: nextId()!,
            index: questionIndex() + 1,
          })}
        >
          Next Question
        </a>
      </Show>
    </div>
  );
};
