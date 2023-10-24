import { forwardRef } from "react";

interface InputProps {
  id?: string;
  type?: string;
  placeholder: string;
  className?: string;
  containerClassName?: string;
  name?: string;
  value?: string;
  readonly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default forwardRef(function Input(
  {
    id,
    type,
    placeholder,
    className,
    containerClassName,
    value,
    onChange,
    readonly,
    name,
  }: InputProps,
  ref: any
) {
  return (
    <div className={`relative ${containerClassName}`}>
      <input
        type={type || "text"}
        className={`${className} quicksand block px-2.5 pb-2.5 pt-4 w-full text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer`}
        defaultValue={value || ""}
        onChange={onChange}
        readOnly={readonly}
        name={name}
        id={id || placeholder}
        placeholder=" "
        ref={ref || null}
      />
      <label
        htmlFor={id || placeholder}
        className="absolute quicksand text-lg cursor-text text-gray-500 duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-bgClr px-2 peer-focus:px-2 peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {placeholder}
      </label>
    </div>
  );
});
