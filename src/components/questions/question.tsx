import { type Component, Match, Show, Switch } from "solid-js";
import type { Question as QuestionType } from "../../content.config";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  question: QuestionType;
  questionCount: number;
  questionIndex: number;
  mediaSrc: string | undefined;
};
export const Question: Component<Props> = (props) => {
  const mediaSrc = () => props.mediaSrc;
  const question = () => props.question;
  const questionCount = () => props.questionCount;
  const questionIndex = () => props.questionIndex;

  return (
    <Card class="max-w-6xl min-w-[40dvw] min-h-32 relative">
      <CardHeader
        classList={{
          "items-center justify-center": true,
          "h-full": !mediaSrc(),
        }}
      >
        <CardTitle class="max-w-2xl text-center">{question().question}</CardTitle>
      </CardHeader>
      <Show when={mediaSrc() && question().mediaType}>
        <CardContent class="justify-center flex">
          <Switch>
            <Match when={question().mediaType === "image"}>
              <img src={mediaSrc()} alt={question().answer} class="max-h-[50dvh] rounded-2xl" />
            </Match>
            <Match when={question().mediaType!.startsWith("audio")}>
              <audio controls>
                <source src={mediaSrc()} type={question().mediaType} />
                <track kind="captions" />
              </audio>
            </Match>
            <Match when={question().mediaType!.startsWith("video")}>
              <video controls class="max-h-[50dvh] rounded-2xl">
                <source src={mediaSrc()} type={question().mediaType} />
                <track kind="captions" />
              </video>
            </Match>
          </Switch>
        </CardContent>
      </Show>
      <Badge variant="outline" class="text-md absolute top-2 left-2">
        Question {questionIndex() + 1} / {questionCount()}
      </Badge>
    </Card>
  );
};
