import { type ComponentProps, type ParentComponent, splitProps } from "solid-js";
import { cn } from "../../lib/utils";

const Card: ParentComponent<ComponentProps<"div">> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);

  return <div class={cn("rounded-xl border bg-card text-card-foreground shadow", local.class)} {...rest} />;
};

const CardHeader: ParentComponent<ComponentProps<"div">> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);

  return <div class={cn("flex flex-col space-y-1.5 p-6", local.class)} {...rest} />;
};

const CardTitle: ParentComponent<ComponentProps<"h3">> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);

  return <h3 class={cn("text-2xl font-semibold leading-none tracking-tight", local.class)} {...rest} />;
};

const CardDescription: ParentComponent<ComponentProps<"p">> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);

  return <p class={cn("text-sm text-muted-foreground", local.class)} {...rest} />;
};

const CardContent: ParentComponent<ComponentProps<"div">> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);

  return <div class={cn("p-6 pt-0", local.class)} {...rest} />;
};

const CardFooter: ParentComponent<ComponentProps<"div">> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);

  return <div class={cn("flex items-center justify-between p-6 pt-0", local.class)} {...rest} />;
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
