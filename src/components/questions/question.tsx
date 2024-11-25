import { type Component, Match, Show, Switch } from "solid-js";
import type { Question as QuestionType } from "../../content.config";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  question: QuestionType;
  questionCount: number;
  questionIndex: number;
};
export const Question: Component<Props> = (props) => {
  const question = props.question;
  return (
    <Card class="max-w-6xl min-w-[30dvw] relative">
      <CardHeader class="items-center">
        <CardTitle class="max-w-2xl text-center">{question.question}</CardTitle>
      </CardHeader>
      <CardContent class="justify-center flex">
        <Show when={question.mediaUrl && question.mediaType}>
          <Switch>
            <Match when={question.mediaType === "image"}>
              <img src={question.mediaUrl} alt={question.answer} class="max-h-[50dvh] rounded-2xl" />
            </Match>
            <Match when={question.mediaType!.startsWith("audio")}>
              <audio controls>
                <source src={question.mediaUrl} type={question.mediaType} />
                <track kind="captions" />
              </audio>
            </Match>
            <Match when={question.mediaType!.startsWith("video")}>
              <video controls class="max-h-[50dvh] rounded-2xl">
                <source src={question.mediaUrl} type={question.mediaType} />
                <track kind="captions" />
              </video>
            </Match>
          </Switch>
        </Show>
      </CardContent>
      <Badge variant="outline" class="text-md absolute top-2 left-2">
        Question {props.questionIndex + 1} of {props.questionCount}
      </Badge>
    </Card>
  );
};
