import { twMerge } from "tailwind-merge";

export function classNames(...classes: string[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
