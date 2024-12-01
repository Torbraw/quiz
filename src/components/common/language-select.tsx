import { getRelativeLocaleUrl } from "astro:i18n";
import type { Component } from "solid-js";
import { splitProps } from "solid-js";
import { LangIcon } from "../../components/common/icons";
import { cn } from "../../lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Props = {
  lang: string;
  class?: string;
};

type LanguageOption = {
  value: string;
  label: string;
};
const languageOptions: LanguageOption[] = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "fr",
    label: "Français",
  },
];

export const LanguageSelect: Component<Props> = (componentProps) => {
  const [local, _rest] = splitProps(componentProps, ["lang", "class"]);

  const handleSelect = (code: string): void => {
    const selected = languageOptions.find((option) => option.value === code) as LanguageOption;
    let formattedPath = window.location.pathname.replace(/^(\/quiz\/)/, "/");
    formattedPath = formattedPath.replace(/^\/[a-z]{2}(\/|$)/, "/");
    const relativePath = getRelativeLocaleUrl(selected.value, formattedPath);
    window.location.href = relativePath + window.location.search;
  };

  return (
    <div class={cn("block", local.class)}>
      <Select
        value={languageOptions.find((option) => option.value === local.lang)!}
        onChange={(code) => code && handleSelect(code.value)}
        options={languageOptions}
        optionValue="value"
        optionTextValue="label"
        itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>}
      >
        <SelectTrigger aria-label="Lang" class="w-[145px]">
          <SelectValue<LanguageOption>>
            {(state) => (
              <div class="flex items-center gap-4">
                <LangIcon class="h-6 w-6" />
                {state.selectedOption().label}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    </div>
  );
};
