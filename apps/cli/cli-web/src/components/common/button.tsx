import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/classnames";

import type { ReactElement } from "react";
import React from "react";

import { ArrowPathIcon } from "@heroicons/react/20/solid";

const LoadingSpinner = () => (
  <ArrowPathIcon className="h-20 animate-spin" aria-hidden="true" />
);

export type HTMLButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export type HTMLAnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const BUTTON_CLASSES =
  "inline-flex items-center border font-medium relative";

export type ButtonVariant = "primary" | "primary-inverted" | "text";

type ButtonSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl";

type ButtonIconPosition = "start" | "end";

type ButtonStyle = {
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export type ButtonProps = {
  icon?: ReactElement;
  iconPosition?: ButtonIconPosition;
  loading?: boolean;
} & ButtonStyle;

export const BUTTON_SIZES = {
  xs: "text-xs px-2.5 py-1.5 rounded",
  sm: "text-sm px-3 py-2 leading-4 rounded",
  base: "text-sm px-4 py-2 rounded",
  lg: "text-base px-4 py-2 rounded-md",
  xl: "text-lg px-6 py-3 rounded-md",
  "2xl": "text-xl px-8 py-3 md:py-4 md:text-2xl md:px-8 rounded-lg",
};

export const ICON_SIZE_CLASSES = {
  xs: "h-4 w-4",
  sm: "h-4 w-4",
  base: "h-5 w-5",
  lg: "h-5 w-5",
  xl: "h-5 w-5",
  "2xl": "h-6 w-6",
};
export const ICON_START_CLASSES = {
  xs: "-ml-0.5 mr-1.5",
  sm: "-ml-0.5 mr-1.5",
  base: "-ml-1 mr-1.5",
  lg: "-ml-1 mr-2",
  xl: "-ml-1 mr-2",
  "2xl": "-ml-1 mr-2",
};
export const ICON_END_CLASSES = {
  xs: "-mr-0.5 ml-1.5",
  sm: "-mr-0.5 ml-1.5",
  base: "-mr-1 ml-1.5",
  lg: "-mr-1 ml-2",
  xl: "-mr-1 ml-2",
  "2xl": "-mr-1 ml-2",
};

export const BUTTON_VARIANTS = {
  primary:
    "text-white border-pink-700 bg-pink-600 hover:bg-pink-700 hover:border-pink-800 shadow-sm",
  "primary-inverted":
    "text-pink-600 border-transparent bg-white hover:bg-pink-50 shadow-sm",
  text: "text-white border-transparent hover:text-gray-300",
};

export const getButtonClasses = (
  style: ButtonStyle = {},
  ...rest: string[]
) => {
  const { disabled, size = "base", variant = "secondary" } = style;
  return classNames(
    BUTTON_CLASSES,
    disabled && "pointer-events-none",
    BUTTON_SIZES[size],
    BUTTON_VARIANTS[variant],
    ...rest
  );
};

const ButtonContent: React.FC<{
  loading?: boolean;
  size?: ButtonSize;
  icon?: ReactElement;
  iconPosition?: ButtonIconPosition;
  children?: React.ReactNode;
}> = ({ loading, icon, iconPosition = "start", size = "base", children }) => {
  return (
    <React.Fragment>
      {loading && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <LoadingSpinner />
        </span>
      )}
      {icon && iconPosition === "start" && (
        <span
          className={classNames(
            { invisible: loading },
            ICON_SIZE_CLASSES[size],
            ICON_START_CLASSES[size]
          )}
        >
          {icon}
        </span>
      )}
      <span className={classNames({ invisible: loading })}>{children}</span>
      {icon && iconPosition === "end" && (
        <span
          className={classNames(
            { invisible: loading },
            ICON_SIZE_CLASSES[size],
            ICON_END_CLASSES[size]
          )}
        >
          {icon}
        </span>
      )}
    </React.Fragment>
  );
};

/**
 * Button component that renders an `<a>` element
 *
 * Wrap with next.js `<Link>` for client side routing
 */
export const ButtonLink = React.forwardRef<
  HTMLAnchorElement,
  ButtonProps & HTMLAnchorProps
>((props, ref) => {
  const {
    children,
    className = "",
    disabled,
    size,
    variant,
    icon,
    iconPosition,
    loading,
    ...rest
  } = props;
  return (
    <a
      className={getButtonClasses({ disabled, size, variant }, className)}
      ref={ref}
      aria-disabled={disabled}
      {...rest}
    >
      <ButtonContent {...props} />
    </a>
  );
});
ButtonLink.displayName = "ButtonLink";

/**
 * Button component that renders a `<button>` element
 *
 * @see {@link ButtonLink} for rendering an `<a>` element
 */
export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & HTMLButtonProps
>((props, ref) => {
  const {
    children,
    className = "",
    disabled,
    size,
    variant,
    icon,
    iconPosition,
    loading,
    ...rest
  } = props;
  return (
    <button
      className={getButtonClasses({ disabled, size, variant }, className)}
      ref={ref}
      type="button"
      aria-disabled={disabled}
      {...rest}
    >
      <ButtonContent {...props} />
    </button>
  );
});

Button.displayName = "Button";

export default Button;

type ListItem = {
  name: string;
  action: () => void;
};

export function SplitButtonDropdown({
  items,
  label,
  icon,
  onClick,
}: {
  items: ListItem[];
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div className="inline-flex rounded-md shadow-sm">
      {onClick ? (
        <button
          onClick={onClick}
          className="relative inline-flex items-center gap-2 rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {icon}
          {label}
        </button>
      ) : (
        <div className="relative inline-flex items-center gap-2 rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
          {icon}
          {label}
        </div>
      )}

      <Menu as="div" className="relative -ml-px block">
        <Menu.Button className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <span className="sr-only">{`Open options`}</span>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {items.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                      onClick={item.action}
                    >
                      {item.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

export const SplitButtonDropdownTheSequel = ({
  items,
  label,
  icon,
  onClick,
}: {
  items: ListItem[];
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button variant="primary" as={Button}>
          {label}
          {icon}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {items.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <Button
                  onClick={item.action}
                  className={classNames(active ? "" : "text-gray-700")}
                >
                  {item.name}
                </Button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
