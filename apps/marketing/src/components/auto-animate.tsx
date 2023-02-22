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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const [ref] = useAutoAnimate<HTMLElement>();
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
};
