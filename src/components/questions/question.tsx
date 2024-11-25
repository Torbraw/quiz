import { type Component, Match, Show, Switch } from "solid-js";
import type { Question as QuestionType } from "../../content.config";

type Props = {
  question: QuestionType;
};
export const Question: Component<Props> = (props) => {
  const question = props.question;
  return (
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
  );
};
