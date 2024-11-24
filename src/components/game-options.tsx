import { type Component, For, Show, createSignal, onMount, splitProps } from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { QuestionWithId } from "../lib/types";
import { fisherYatesShuffle } from "../lib/utils";
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

type GameOptionsProps = {
  questions: QuestionWithId[];
  categories: string[];
};
export const GameOptions: Component<GameOptionsProps> = (props) => {
  const [local, _] = splitProps(props, ["questions", "categories"]);

  const [timer, setTimer] = createSignal<boolean>(true);
  const [timerDuration, setTimerDuration] = createSignal<number>(60);

  const [autoShowAnswer, setAutoShowAnswer] = createSignal<boolean>(true);
  const [numberOfQuestions, setNumberOfQuestions] = createSignal<number>(10);

  const [categories, setCategories] = createStore<
    {
      category: string;
      selected: boolean;
    }[]
  >(local.categories.map((category) => ({ category, selected: false })));

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

    const selectedCategories = categories.filter((category) => category.selected);
    const finalCategories = selectedCategories.length > 0 ? selectedCategories : categories;
    const selectedCategoryNames = finalCategories.map((category) => category.category);

    const questions = pickQuestions(selectedCategoryNames, numberOfQuestions());
    if (questions.size === 0) {
      alert("No questions found for the selected categories");
      return;
    }

    const gameOptions = {
      timer: timer(),
      timerDuration: timerDuration(),
      autoShowAnswer: autoShowAnswer(),
      questions,
    };

    localStorage.setItem("gameOptions", JSON.stringify(gameOptions));

    const [_, value] = questions.entries().next().value!;
    window.location.href = `/questions/${value.id}?st=${timer()}&td=${timerDuration()}&sa=${autoShowAnswer()}&nq=${numberOfQuestions()}&cq=0`;
  };

  const pickQuestions = (includedCategories: string[], count: number) => {
    const filteredQuestions = local.questions.filter((question) => {
      return includedCategories.includes(question.category);
    });

    const shuffled = fisherYatesShuffle(filteredQuestions);
    const selectedQuestions = shuffled.slice(0, count);

    return selectedQuestions.reduce((map, question) => {
      map.set(question.id, question);
      return map;
    }, new Map<string, QuestionWithId>());
  };

  onMount(() => {
    localStorage.removeItem("gameOptions");
  });

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <CardContent class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <div class="flex flex-row gap-2 items-center">
            <TagIcon class="w-6 h-6" />
            <span class="font-semibold text-xl">Categories</span>
            <Badge variant="outline" class="mt-1.5">
              Default to all
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
                  classList={{ "!bg-primary": category.selected }}
                >
                  {category.category}
                </Button>
              )}
            </For>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-row gap-2 items-center">
            <TimerIcon class="w-6 h-6" />
            <span class="font-semibold text-xl">Timer</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <Switch class="flex items-center gap-2 mt-5" checked={timer()} onChange={(e) => setTimer(e)}>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel class="text-sm font-medium leading-none">Enabled</SwitchLabel>
            </Switch>
            <Show when={timer()}>
              <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="timerDuration">Duration (s)</Label>
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
            <span class="font-semibold text-xl">Others</span>
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
              <SwitchLabel class="text-sm font-medium leading-none">Auto Show Answer</SwitchLabel>
            </Switch>

            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label for="numberOfQuestions">Number of Questions</Label>
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
        <Button type="submit" size="lg">
          Start Game
        </Button>
      </CardFooter>
    </form>
  );
};
