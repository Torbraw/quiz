import { type Component, Show, createSignal } from "solid-js";
import type { Question } from "../../content.config";
import { useTranslations } from "../../lib/utils";
import { DiamongFourIcon, InfoIcon, TagIcon } from "../common/icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Props = {
  question: Question;
  locale: string;
};
export const Information: Component<Props> = (props) => {
  const t = useTranslations(props.locale);
  const question = () => props.question;

  const [showHint, setShowHint] = createSignal(false);

  return (
    <div class="flex items-center flex-col gap-4">
      <div class="flex flex-row gap-4">
        <Badge variant="secondary" class="flex flex-row gap-2 items-center">
          <TagIcon class="w-6 h-6" />
          {t(`categoryEnum.${question().category}` as keyof typeof t)}
        </Badge>

        <Badge
          variant="outline"
          classList={{
            "flex flex-row gap-2 items-center": true,
            "bg-green-500/20 text-green-200": question().difficulty === 1,
            "bg-yellow-500/20 text-yellow-200": question().difficulty === 2,
            "bg-red-500/20 text-red-200": question().difficulty === 3,
          }}
        >
          <DiamongFourIcon class="w-6 h-6" />
          {t(`difficulty.${question().difficulty}` as keyof typeof t)}
        </Badge>
      </div>
      <Show when={question().hint}>
        <div class="flex flex-row gap-2 items-center h-8">
          <Show
            when={showHint()}
            fallback={
              <Button class="gap-2" variant="ghost" size="sm" onClick={() => setShowHint(true)}>
                <InfoIcon class="w-6 h-6" /> {t("showHint")}
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
