import { createTimer } from "@solid-primitives/timer";
import { type Component, createEffect, createSignal, onMount } from "solid-js";

type Props = {
  duration: number;
  onEnd: () => void;
  clear?: boolean;
};
export const Timer: Component<Props> = (props) => {
  const duration = () => props.duration;
  const clear = () => props.clear ?? false;
  const [timeLeft, setTimeLeft] = createSignal(duration());
  const [pauseTimer, setPauseTimer] = createSignal(false);

  const progress = () => (1 - timeLeft() / duration()) * 100;

  const formatTime = () => {
    const minutes = Math.floor(timeLeft() / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft() % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  createEffect(() => {
    if (clear()) {
      setTimeLeft(0);
    }
  });

  onMount(() => {
    createTimer(
      () => {
        if (timeLeft() <= 0) {
          setPauseTimer(true);
          props.onEnd();
        } else {
          setTimeLeft((prev) => prev - 1);
        }
      },
      () => !pauseTimer() && 1000,
      setInterval,
    );
  });

  return (
    <div
      class="relative flex items-center justify-center w-32 h-32 cursor-pointer hover:scale-[0.98]"
      onClick={() => setPauseTimer((prev) => !prev)}
      onKeyPress={(e) => e.key === " " && setPauseTimer((prev) => !prev)}
    >
      <div class="absolute w-full h-full">
        <svg class="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          <title>Timer</title>
          <circle class="stroke-muted fill-none" cx="50" cy="50" r="45" fill="none" stroke-width="5" />
          <circle
            class="stroke-primary fill-none transition-all duration-500 ease-in-out"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke-width="5"
            stroke-dasharray="282.6"
            stroke-dashoffset={`${282.6 * (1 - progress() / 100)}`}
            stroke-linecap="round"
          />
        </svg>
      </div>

      <div class="text-foreground font-bold text-2xl">{formatTime()}</div>
    </div>
  );
};
