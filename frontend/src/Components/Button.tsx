import { Link } from "react-router-dom";

interface ButtonProps {
  onClick?: () => void;
  type: "default" | "alt";
  isLink?: boolean;
  to?: string;
  className?: string;
  children: React.ReactNode;
  submit?: boolean;
}

export default function Button({
  onClick,
  className,
  children,
  type,
  isLink,
  to,
  submit,
}: ButtonProps) {
  const link = (
    <Link
      to={to || "/"}
      className={`${
        type === "alt"
          ? "sm:w-96 w-72 active:scale-90 transition-all border-purple-600 border-2 text-2xl p-2 text-purple-600 box-border font-sans rounded-lg"
          : "sm:w-96 w-72 active:scale-90 transition-all bg-purple-600 text-2xl p-2 text-white font-sans rounded-lg box-border border-2 border-purple-600"
      } ${className || ""}`}
    >
      {children}
    </Link>
  );

  const button = (
    <button
      onClick={onClick}
      className={`${
        type === "alt"
          ? "sm:w-96 w-72 active:scale-90 transition-all border-purple-600 border-2 text-2xl p-2 text-purple-600 box-border font-sans rounded-lg"
          : "sm:w-96 w-72 active:scale-90 transition-all bg-purple-600 text-2xl p-2 text-white font-sans rounded-lg box-border border-2 border-purple-600"
      } ${className || ""}`}
      type={submit ? "submit" : "button"}
    >
      {children}
    </button>
  );

  return isLink ? link : button;
}
