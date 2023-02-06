import type { TippyProps } from "@tippyjs/react";
import Tippy from "@tippyjs/react";

export const Tooltip: React.FC<TippyProps & { rawContent?: boolean }> = ({
  content,
  children,
  rawContent = false,
  ...rest
}) => {
  // if no tooltip content, just render children (otherwise, it'll be a blank tooltip)
  if (!content) return <>{children}</>;

  if (rawContent) {
    return (
      <Tippy content={content} offset={[0, 5]} {...rest}>
        {children}
      </Tippy>
    );
  }

  const tip = (
    <span className="rounded bg-gray-300/90 py-1 px-1.5 text-xs font-medium text-gray-800">
      {content}
    </span>
  );

  return (
    <Tippy content={tip} offset={[0, 5]} {...rest}>
      {children}
    </Tippy>
  );
};
