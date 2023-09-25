"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "@heroicons/react/20/solid";

import { classNames } from "../../utils/classnames";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={classNames(
      "group peer h-4 w-4 shrink-0 rounded border border-gray-300 shadow focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
      className || ""
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={classNames("flex items-center justify-center text-current")}
    >
      <CheckIcon
        height={"15px"}
        width={"15px"}
        className="hidden h-[15px] w-[15px] group-data-[state=checked]:block"
      />
      <MinusIcon
        height={"15px"}
        width={"15px"}
        className="hidden h-[15px] w-[15px] group-data-[state=indeterminate]:block"
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
