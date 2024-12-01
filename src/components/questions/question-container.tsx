import { getRelativeLocaleUrl } from "astro:i18n";
import { type Component, Show, createSignal, onMount } from "solid-js";
import type { Question as QuestionType } from "../../content.config";
import type { GameHistory, GameOptions } from "../../lib/types";
import { buildQuestionUrl, useTranslations } from "../../lib/utils";
import { ArrowRightIcon } from "../common/icons";
import { Timer } from "../common/timer";
import { Button, buttonVariants } from "../ui/button";
import { Information } from "./information";
import { Question } from "./question";

type Props = {
  question: QuestionType;
  locale: string;
  mediaSrc: string | undefined;
};
export const QuestionContainer: Component<Props> = (props) => {
  const locale = () => props.locale;
  const t = useTranslations(props.locale);
  const mediaSrc = () => props.mediaSrc;
  const question = () => props.question;

  const [clearTimer, setClearTimer] = createSignal(false);
  const [showTimer, setShowTimer] = createSignal(false);
  const [duration, setDuration] = createSignal(0);
  const [questionCount, setQuestionCount] = createSignal(0);
  const [questionIndex, setQuestionIndex] = createSignal(0);
  const [nextId, setNextId] = createSignal<string>();
  const [autoShowAnswer, setAutoShowAnswer] = createSignal(false);
  const [showAnswer, setShowAnswer] = createSignal(false);
  const [gameOptions, setGameOptions] = createSignal<GameOptions>();

  const onTimerEnd = () => {
    if (autoShowAnswer()) {
      setShowAnswer(true);
    }
  };

  const saveGameInHistory = () => {
    const options = gameOptions();
    if (options) {
      try {
        const localStorageHistory = localStorage.getItem("gameHistory");
        let history: GameHistory = { games: [] };
        if (localStorageHistory) {
          history = JSON.parse(localStorageHistory);
        }
        history.games.push(options);
        localStorage.setItem("gameHistory", JSON.stringify(history));
      } catch (e) {
        console.error("Error saving game in history", e);
      }
    }
  };

  onMount(() => {
    const params = new URLSearchParams(window.location.search);

    const timerDuration = params.get("td") ?? "60";
    setDuration(+timerDuration);

    const showAnswer = (params.get("sa") ?? "true") === "true";
    setAutoShowAnswer(showAnswer);

    const show = (params.get("st") ?? "true") === "true";
    setShowTimer(show);

    if (!show) {
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
        setGameOptions(options);
        setQuestionCount(options.questionIds.length);
        const next = options.questionIds[index + 1];
        setNextId(next);
      } catch (e) {
        console.error("Error parsing game options", e);
      }
    } else {
      console.error("No game options found");
    }
  });

  return (
    <div class="flex flex-col gap-4">
      <Show when={showTimer()}>
        <div class="absolute top-8 left-8">
          <Timer duration={duration()} onEnd={() => onTimerEnd()} clear={clearTimer()} />
        </div>
      </Show>

      <Information question={question()} locale={props.locale} />

      <Question
        question={question()}
        questionCount={questionCount()}
        questionIndex={questionIndex()}
        mediaSrc={mediaSrc()}
      />

      <Show
        when={showAnswer()}
        fallback={
          <div class="flex justify-center">
            <Button
              variant="secondary"
              size="lg"
              type="button"
              onClick={() => {
                setClearTimer(true);
                setShowAnswer(true);
              }}
            >
              {t("showAnswer")}
            </Button>
          </div>
        }
      >
        <div class="flex justify-center">
          <div class="flex min-w-[48rem] text-lg max-w-3xl min-h-12 justify-center items-center rounded-xl font-bold border text-success-foreground border-success/60 bg-success/10 shadow">
            {question().answer}
          </div>
        </div>
      </Show>

      <Show when={showAnswer()}>
        <div class="flex justify-center">
          <Show
            when={nextId()}
            fallback={
              <div class="flex flex-col gap-4 items-center">
                <p>{t("allAnswered")}</p>
                <p>{t("allAnswered2")}</p>
                <div class="flex flex-row gap-4">
                  <a
                    aria-label="new-game"
                    classList={{
                      [buttonVariants({ size: "lg", variant: "secondary" })]: true,
                      "gap-2": true,
                    }}
                    href={getRelativeLocaleUrl(locale(), "/options", { prependWith: "quiz" })}
                    onClick={() => saveGameInHistory()}
                  >
                    {t("newGame")}
                  </a>
                  <a
                    aria-label="new-game"
                    classList={{
                      [buttonVariants({ size: "lg", variant: "secondary" })]: true,
                      "gap-2": true,
                    }}
                    href={getRelativeLocaleUrl(locale(), "/history", { prependWith: "quiz" })}
                    onClick={() => saveGameInHistory()}
                  >
                    {t("seeHistory")}
                  </a>
                </div>
              </div>
            }
          >
            <a
              aria-label="next-question"
              classList={{
                [buttonVariants({ size: "lg" })]: true,
                "gap-2": true,
              }}
              href={buildQuestionUrl({
                locale: locale(),
                duration: duration(),
                autoShowAnswer: autoShowAnswer(),
                showTimer: showTimer(),
                nextId: nextId()!,
                index: questionIndex() + 1,
              })}
            >
              <span>{t("nextQuestion")}</span> <ArrowRightIcon class="h-6 w-6" />
            </a>
          </Show>
        </div>
      </Show>
    </div>
  );
};
