import { Link } from "react-router-dom";

interface ButtonProps {
  onClick?: () => void;
  type: "default" | "alt";
  isLink?: boolean;
  to?: string;
  className?: string;
  children: React.ReactNode;
  submit?: boolean;
  disabled?: boolean;
  width?: string;
}

export default function Button({
  onClick,
  className,
  children,
  type,
  isLink,
  to,
  disabled,
  submit,
  width,
}: ButtonProps) {
  const link = (
    <Link
      to={to || "/"}
      className={`${
        type === "alt"
          ? "active:scale-90 transition-all border-purple-600 border-2 text-2xl p-2 text-purple-600 box-border font-sans rounded-lg"
          : "active:scale-90 transition-all bg-purple-600 text-2xl p-2 text-white font-sans rounded-lg box-border border-2 border-purple-600"
      } flex items-center justify-center gap-2 box-border ${className} ${
        width || "sm:w-96 w-72"
      }`}
    >
      {children}
    </Link>
  );

  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${
        type === "alt"
          ? "active:scale-90 transition-all border-purple-600 border-2 text-2xl p-2 text-purple-600 box-border font-sans rounded-lg"
          : "active:scale-90 transition-all bg-purple-600 text-2xl p-2 text-white font-sans rounded-lg box-border border-2 border-purple-600"
      } flex gap-2 items-center justify-center box-border ${className}  ${width || "sm:w-96 w-72"} ${disabled && "!bg-gray-500 !border-gray-500"}`}
      type={submit ? "submit" : "button"}
    >
      {children}
    </button>
  );

  return isLink ? link : button;
}
