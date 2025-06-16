"use client"

export default function Button({ text, onClick, disabled, style }: {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: Record<string | number, string & {}>;
}) {
  return (
    <button
      className={`
        bg-teal-500
        hover:bg-teal-700
        text-white
        flex flex-row py-2 px-3 mb-2 w-36 rounded-lg bg-blue items-center justify-center dark:bg-blueDark whitespace-nowrap`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      <span className="select-none text-base text-white100 dark:text-black100">
        {text}
      </span>
    </button>
  );
}