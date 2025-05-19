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
        bg-blue-500
        text-gray-200
        flex flex-row py-2 px-3 mb-2 w-48 rounded-lg bg-blue items-center justify-center dark:bg-blueDark`}
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