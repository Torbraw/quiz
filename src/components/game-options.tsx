import { type Component, For, Show, createSignal, onMount, splitProps } from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { GameHistory, GameOptions as GameOptionsType, QuestionWithId } from "../lib/types";
import { buildQuestionUrl, fisherYatesShuffle, useTranslations } from "../lib/utils";
import { GearIcon, TagIcon, TimerIcon } from "./common/icons";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "./ui/switch";

const MIN_TIMER_DURATION = 30;
const MAX_TIMER_DURATION = 300;
const MIN_NUMBER_OF_QUESTIONS = 1;
const MAX_NUMBER_OF_QUESTIONS = 20;

type Props = {
  questions: QuestionWithId[];
  categories: string[];
  locale: string;
};
export const GameOptions: Component<Props> = (props) => {
  const locale = () => props.locale;
  const t = useTranslations(props.locale);
  const [local, _] = splitProps(props, ["questions", "categories"]);

  const [showTimer, setShowTimer] = createSignal<boolean>(true);
  const [timerDuration, setTimerDuration] = createSignal<number>(60);

  const [autoShowAnswer, setAutoShowAnswer] = createSignal<boolean>(true);
  const [numberOfQuestions, setNumberOfQuestions] = createSignal<number>(10);
  const [availableQuestions, setAvailableQuestions] = createSignal<QuestionWithId[]>(local.questions);

  const [categories, setCategories] = createStore<
    {
      category: string;
      selected: boolean;
      questionCount: number;
    }[]
  >(
    local.categories.map((category) => ({
      category,
      selected: false,
      questionCount: 0,
    })),
  );

  const totalSelectecQuestionCount = () => {
    const selectedCategories = categories.filter((category) => category.selected);
    if (selectedCategories.length > 0) {
      return selectedCategories.reduce((acc, category) => acc + category.questionCount, 0);
    }
    return availableQuestions().length;
  };

  const handleCategorySelect = (category: string) => {
    setCategories(
      (c) => c.category === category,
      produce((c) => {
        c.selected = !c.selected;
      }),
    );
  };

  const handleDurationChange = (e: Event) => {
    const value = Number.parseInt((e.target as HTMLInputElement).value) || 0;
    if (value >= MIN_TIMER_DURATION && value <= MAX_TIMER_DURATION) {
      setTimerDuration(value);
    }
  };

  const handleNumberOfQuestionsChange = (e: Event) => {
    const value = Number.parseInt((e.target as HTMLInputElement).value) || 0;
    if (value >= MIN_NUMBER_OF_QUESTIONS && value <= MAX_NUMBER_OF_QUESTIONS) {
      setNumberOfQuestions(value);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (autoShowAnswer() && !showTimer()) {
      alert(t("error.autoShowAnswer"));
      return;
    }

    const selectedCategories = categories.filter((category) => category.selected);
    const finalCategories = selectedCategories.length > 0 ? selectedCategories : categories;
    const selectedCategoryNames = finalCategories.map((category) => category.category);

    const questionIds = pickQuestionIds(selectedCategoryNames, numberOfQuestions());
    if (questionIds.length === 0) {
      alert(t("error.noQuestions"));
      return;
    }

    try {
      const gameOptions = {
        showTimer: showTimer(),
        timerDuration: timerDuration(),
        autoShowAnswer: autoShowAnswer(),
        questionIds,
      } satisfies GameOptionsType;
      localStorage.setItem("gameOptions", JSON.stringify(gameOptions));
    } catch (e) {
      console.error("Error saving game options", e);
      return;
    }

    window.location.href = buildQuestionUrl({
      locale: locale(),
      duration: timerDuration(),
      autoShowAnswer: autoShowAnswer(),
      showTimer: showTimer(),
      nextId: questionIds[0]!,
      index: 0,
    });
  };

  const pickQuestionIds = (includedCategories: string[], count: number) => {
    const filteredQuestions = availableQuestions().filter((question) => {
      return includedCategories.includes(question.category);
    });
    const shuffled = fisherYatesShuffle(filteredQuestions);
    return shuffled.slice(0, count).map((question) => question.id);
  };

  onMount(() => {
    try {
      localStorage.removeItem("gameOptions");

      const gameHistory = localStorage.getItem("gameHistory");
      if (gameHistory) {
        const history = JSON.parse(gameHistory) as GameHistory;
        const ids = new Set(history.games.flatMap((game) => game.questionIds));
        const questions = local.questions.filter((question) => !ids.has(question.id));
        setAvailableQuestions(questions);
      } else {
        setAvailableQuestions(local.questions);
      }

      const categories = local.categories.map((category) => ({
        category,
        selected: false,
        questionCount: availableQuestions().filter((question) => question.category === category).length,
      }));
      setCategories(categories);
    } catch (e) {
      console.error("Error loading game options", e);
    }
  });

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <CardContent class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <div class="flex flex-row gap-2 items-center">
            <TagIcon class="w-6 h-6" />
            <span class="font-semibold text-xl">{t("categories")}</span>
            <Badge variant="outline" class="mt-1 mr-auto">
              {t("allSelected")}
            </Badge>
            <Badge variant="outline" class="mt-1 text-primary">
              {totalSelectecQuestionCount()} {t("questionsAvailable")}
            </Badge>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <For each={categories}>
              {(category) => (
                <Button
                  type="button"
                  onClick={[handleCategorySelect, category.category]}
                  variant="secondary"
                  size="lg"
                  classList={{ relative: true, "!bg-primary": category.selected }}
                >
                  {t(`categoryEnum.${category.category}` as keyof typeof t)}
                  <span
                    classList={{
                      "absolute -top-2 -right-2 px-2 py-1 min-w-9 text-xs rounded-full": true,
                      "bg-primary text-primary-foreground": !category.selected,
                      "bg-primary-foreground text-primary": category.selected,
                    }}
                  >
                    {category.questionCount}
                  </span>
                </Button>
              )}
            </For>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-row gap-2 items-center">
            <TimerIcon class="w-6 h-6" />
            <span class="font-semibold text-xl">{t("timer")}</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <Switch class="flex items-center gap-2 mt-5" checked={showTimer()} onChange={(e) => setShowTimer(e)}>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel class="text-sm font-medium leading-none">{t("enabled")}</SwitchLabel>
            </Switch>
            <Show when={showTimer()}>
              <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="timerDuration">{t("durationSeconds")}</Label>
                <Input
                  max={MAX_TIMER_DURATION}
                  min={MIN_TIMER_DURATION}
                  type="number"
                  id="timerDuration"
                  class="w-32"
                  value={timerDuration()}
                  onInput={(e) => handleDurationChange(e)}
                />
              </div>
            </Show>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-row gap-2 items-center">
            <GearIcon class="w-6 h-6" />
            <span class="font-semibold text-xl">{t("others")}</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <Switch
              class="flex items-center gap-2 mt-5"
              checked={autoShowAnswer()}
              onChange={(e) => setAutoShowAnswer(e)}
            >
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel class="text-sm font-medium leading-none">{t("autoShowAnswer")}</SwitchLabel>
            </Switch>

            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label for="numberOfQuestions">{t("maximumNumberOfQuestions")}</Label>
              <Input
                max={MAX_NUMBER_OF_QUESTIONS}
                min={MIN_NUMBER_OF_QUESTIONS}
                type="number"
                id="numberOfQuestions"
                class="w-32"
                value={numberOfQuestions()}
                onInput={(e) => handleNumberOfQuestionsChange(e)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter class="justify-end">
        <Button type="submit" disabled={totalSelectecQuestionCount() <= 0}>
          {t("startGame")}
        </Button>
      </CardFooter>
    </form>
  );
};
