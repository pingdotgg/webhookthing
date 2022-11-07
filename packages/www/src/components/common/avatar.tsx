import classNames from "classnames";

type AvatarSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "full";

export const AVATAR_SIZES = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  base: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
  "2xl": "w-18 h-18",
  "3xl": "w-24 h-24",
  full: "h-full w-full",
};

export const Avatar: React.FC<{
  size?: AvatarSize;
  alt?: string;
  image?: string | null;
  loading?: boolean;
}> = (props) => {
  const {
    size = "base",
    image,
    alt = "User Avatar",
    loading = false,
    ...rest
  } = props;
  const classes = classNames(
    "inline-flex rounded-full overflow-hidden aspect-square bg-gray-600",
    AVATAR_SIZES[size]
  );

  if (!image || loading)
    return (
      <span className={classes} {...rest}>
        <span className="sr-only">{alt}</span>
        <svg
          className={classNames("h-full w-full text-gray-300", {
            "animate-pulse": loading,
          })}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
    );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={classes}
      src={image}
      alt={alt}
      {...rest}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23D4D4D8' viewBox='0 0 24 24'%3E%3Cpath d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E";
      }}
    />
  );
};
