import { classnames } from "@libs/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;
  disabled?: boolean;
  [key: string]: any;
}

export default function Button({
  large = false,
  onClick,
  text,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={classnames(
        "w-full bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none transition-colors",
        large ? "py-3 text-base" : "py-2 text-sm ",
        disabled ? "bg-orange-300 cursor-not-allowed hover:bg-orange-300" : ""
      )}
    >
      {text}
    </button>
  );
}
