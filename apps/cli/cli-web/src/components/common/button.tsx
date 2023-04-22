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
  "inline-flex items-center border font-medium border-transparent relative focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-transparent hover:focus:ring-offset-gray-200 hover:focus:outline-none aria-disabled:cursor-not-allowed";

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

type ButtonSize = keyof typeof BUTTON_SIZES;

type ButtonIconPosition = "start" | "end";

type ButtonWidth = keyof typeof BUTTON_WIDTHS;

type ButtonAlignment = keyof typeof BUTTON_ALIGNMENTS;

type ButtonShadow = keyof typeof BUTTON_SHADOW_CLASSES;

type ButtonStyle = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  width?: ButtonWidth;
  alignment?: ButtonAlignment;
  shadow?: ButtonShadow;
};

export type ButtonProps = {
  icon?: ReactElement;
  iconPosition?: ButtonIconPosition;
  loading?: boolean;
} & ButtonStyle;

export const BUTTON_SIZES = {
  base: "text-sm px-2 py-1 h-8 leading-4 rounded-md",
  lg: "text-base px-4 py-2 h-10 rounded-md",
};

export const BUTTON_WIDTHS = {
  full: "w-full",
  auto: "w-auto",
};

export const BUTTON_ALIGNMENTS = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export const BUTTON_SHADOW_CLASSES = {
  false: "",
  true: "shadow-sm hover:shadow-md aria-disabled:hover:shadow-sm",
};

export const ICON_SIZE_CLASSES = {
  xs: "h-4 w-4",
  sm: "h-4 w-4",
  base: "h-4 w-4",
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
    "bg-white border-gray-50 text-gray-600 hover:text-indigo-600 aria-disabled:bg-gray-50 aria-disabled:text-gray-400 aria-disabled:hover:text-gray-400 hover:bg-gray-200 hover:border-transparent",
  indigo:
    "bg-indigo-600 text-white border border-transparent hover:bg-indigo-700  aria-disabled:bg-gray-600/80 aria-disabled:hover:bg-gray-600/80",
  "primary-inverted":
    "text-indigo-600 border-transparent bg-white hover:bg-indigo-50 aria-disabled:hover:bg-white",
  text: "text-white border-transparent hover:text-gray-300",
};

export const getButtonClasses = (
  style: ButtonStyle = {},
  ...rest: string[]
) => {
  const {
    size = "base",
    variant = "primary",
    width = "auto",
    alignment = "center",
    shadow = "true",
  } = style;
  return classNames(
    BUTTON_CLASSES,
    BUTTON_SIZES[size],
    BUTTON_VARIANTS[variant],
    BUTTON_WIDTHS[width],
    BUTTON_ALIGNMENTS[alignment],
    BUTTON_SHADOW_CLASSES[shadow] || "",
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
            ICON_SIZE_CLASSES[size],
            ICON_START_CLASSES[size]
          )}
        >
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === "end" && (
        <span
          className={classNames(
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
    size,
    variant,
    width,
    alignment,
    icon,
    iconPosition,
    loading,
    ...rest
  } = props;
  return (
    <a
      className={getButtonClasses(
        { size, variant, width, alignment },
        className
      )}
      ref={ref}
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
    width,
    alignment,
    shadow,
    icon,
    iconPosition,
    loading,
    ...rest
  } = props;
  return (
    <button
      className={getButtonClasses(
        { size, variant, width, alignment, shadow },
        className
      )}
      ref={ref}
      type="button"
      aria-disabled={disabled}
      disabled={disabled}
      {...rest}
    >
      <ButtonContent {...props} />
    </button>
  );
});

Button.displayName = "Button";

export default Button;

type ListItemCommon = {
  name: string;
};
type ListItemButton = ListItemCommon & {
  type: "button";
  action: () => void;
};

type ListItemLink = ListItemCommon & {
  type: "link";
  href: string;
};

type ListItem = ListItemButton | ListItemLink;

export type ListItemWithIcon = ListItem & {
  icon?: React.ReactElement;
};

function isLink(item: ListItem): item is ListItemLink {
  return !!(item as ListItemLink).href;
}

function isButton(item: ListItem): item is ListItemButton {
  return !!(item as ListItemButton).action;
}

export const SplitButtonDropdown = ({
  items,
  label,
  srlabel = false,
  icon,
  onClick,
}: {
  items: ListItemWithIcon[];
  label: string;
  srlabel?: boolean;
  icon?: ReactElement;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className="inline-flex rounded-md shadow-sm hover:shadow-md">
      {onClick ? (
        <Button
          shadow="false"
          className="rounded-r-none"
          icon={icon}
          onClick={onClick}
        >
          {srlabel ? <span className="sr-only">{label}</span> : label}
        </Button>
      ) : (
        <div className="relative inline-flex items-center gap-2 rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
          {srlabel ? <span className="sr-only">{label}</span> : label}
          {icon}
        </div>
      )}

      <Menu as="div" className="relative inline-block">
        <Menu.Button
          className="rounded-l-none"
          variant="primary"
          shadow="false"
          as={Button}
        >
          <span className="sr-only">{`Open options`}</span>
          <ChevronDownIcon
            className={ICON_SIZE_CLASSES["base"]}
            aria-hidden="true"
          />
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
          <Menu.Items className="min-w-36 absolute right-0 z-10 mt-2 origin-top-right  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="w-fit min-w-full">
              {items.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <div className="flex w-full flex-row items-center justify-start overflow-clip first:rounded-t-lg last:rounded-b-lg">
                      <DropdownButtonItemContent item={item} active={active} />
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export const ButtonDropdown = ({
  items,
  label,
  srlabel = false,
  icon,
  ...rest
}: {
  items: ListItemWithIcon[];
  label: string;
  srlabel?: boolean;
  icon?: React.ReactNode;
} & ButtonProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button as={Button} {...rest}>
          {srlabel ? <span className="sr-only">{label}</span> : label}
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="w-fit min-w-full">
            {items.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <div className="flex w-full flex-row items-center justify-start overflow-clip first:rounded-t-lg last:rounded-b-lg">
                    <DropdownButtonItemContent item={item} active={active} />
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const DropdownButtonItemContent = ({
  item,
  active,
}: {
  item: ListItemWithIcon;
  active: boolean;
}) => {
  if (item.type === "link" || isLink(item)) {
    return (
      <ButtonLink
        className={classNames(
          active ? "bg-gray-100 text-indigo-700" : "text-gray-700",
          "flex flex-row items-center justify-start gap-2 rounded-none px-4 py-2 text-sm  hover:bg-gray-100"
        )}
        width="full"
        size="lg"
        alignment="left"
        shadow="false"
        icon={item.icon}
        href={item.href}
      >
        {item.name}
      </ButtonLink>
    );
  }
  if (item.type === "button" || isButton(item)) {
    return (
      <Button
        className={classNames(
          active ? "bg-gray-100 text-indigo-700" : "text-gray-700",
          "flex w-full flex-row items-center justify-start gap-2 rounded-none px-4 py-2 text-sm  hover:bg-gray-100"
        )}
        width="full"
        size="lg"
        alignment="left"
        onClick={item.action}
        shadow="false"
        icon={item.icon}
      >
        {item.name}
      </Button>
    );
  }

  // should never happen
  return null;
};
