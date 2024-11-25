import { type Component, Show, createSignal } from "solid-js";
import type { Question } from "../../content.config";
import { InfoIcon, TagIcon } from "../common/icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Props = {
  question: Question;
};
export const Information: Component<Props> = (props) => {
  const question = () => props.question;

  const [showHint, setShowHint] = createSignal(false);

  return (
    <div class="flex items-center flex-col gap-2">
      <Badge variant="secondary" class="flex flex-row gap-2 items-center py-1.5 px-3.5 hover:bg-secondary text-xl">
        <TagIcon class="w-6 h-6" />
        {question().category}
      </Badge>
      <Show when={question().hint}>
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
            <h3 class="text-sm">{question().hint}</h3>
          </Show>
        </div>
      </Show>
    </div>
  );
};
