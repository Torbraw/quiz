import { type Component, Show, createSignal, onMount } from "solid-js";
import type { Question as QuestionType } from "../../content.config";
import type { GameOptions } from "../../lib/types";
import { buildQuestionUrl } from "../../lib/utils";
import { ArrowRightIcon } from "../common/icons";
import { Timer } from "../common/timer";
import { Button, buttonVariants } from "../ui/button";
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
  const [showAnswerButton, setShowAnswerButton] = createSignal(false);

  const onTimerEnd = () => {
    setShowAnswerButton(true);
    if (autoShowAnswer()) {
      setShowAnswer(true);
    }
  };

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const count = +(params.get("c") ?? "10");
    setQuestionCount(count);

    const timerDuration = params.get("td") ?? "60";
    setDuration(+timerDuration);

    const showAnswer = (params.get("sa") ?? "true") === "true";
    setAutoShowAnswer(showAnswer);

    const show = (params.get("st") ?? "true") === "true";
    setShowTimer(show);

    if (!show) {
      setShowAnswerButton(true);
      if (showAnswer) {
        setShowAnswer(true);
      }
    }

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
    <div class="flex flex-col gap-4">
      <Show when={showTimer()}>
        <div class="absolute top-8 left-8">
          <Timer duration={2} onEnd={() => onTimerEnd()} />
        </div>
      </Show>

      <Information question={question} />

      <Question question={question} questionCount={questionCount()} questionIndex={questionIndex()} />

      <Show when={showAnswerButton()}>
        <Show
          when={showAnswer()}
          fallback={
            <Button
              variant="secondary"
              size="lg"
              type="button"
              onClick={() => {
                setShowAnswer(true);
              }}
            >
              Show Answer
            </Button>
          }
        >
          <div class="flex justify-center">
            <div class="flex min-w-[48rem] max-w-3xl min-h-12 justify-center items-center rounded-xl font-bold border text-success-foreground border-success/60 bg-success/10 shadow">
              {question.answer}
            </div>
          </div>
        </Show>
      </Show>

      <Show when={nextId() && showAnswer()}>
        <div class="flex justify-center">
          <a
            aria-label="next question"
            classList={{
              [buttonVariants({ size: "lg" })]: true,
              "gap-2": true,
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
            <span>Next Question</span> <ArrowRightIcon class="h-6 w-6" />
          </a>
        </div>
      </Show>
    </div>
  );
};
