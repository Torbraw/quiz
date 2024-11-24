import { type ComponentProps, type ParentComponent, splitProps } from "solid-js";
import { cn } from "../../lib/utils";

export const Label: ParentComponent<ComponentProps<"label">> = (props) => {
  const [local, rest] = splitProps(props, ["class", "for"]);

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: This is a label component
    <label
      class={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        local.class,
      )}
      {...rest}
    />
  );
};
