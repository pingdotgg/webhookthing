import type { ElementType, HTMLAttributes } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const AutoAnimate: React.FC<Props> = ({
  as: Tag = "div",
  children,
  ...rest
}) => {
  const [ref] = useAutoAnimate<HTMLElement>();
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
};
