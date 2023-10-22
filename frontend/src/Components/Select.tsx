import { forwardRef } from "react";

interface SelectProps {
  children?: any,
  className?: string,
  defaultValue?: string
}

export default forwardRef(function Select(
  {
    children,
    className,
    defaultValue
  }: SelectProps,
  ref: any) {

  return (
    <select
      defaultValue={defaultValue}
      ref={ref}
      className={`quicksand block px-2.5 py-2 text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer ${className}`}>
      {children}
    </select>
  );
});