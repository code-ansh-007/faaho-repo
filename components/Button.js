export const Button = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  imagesSelected
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`{imagesSelected ? "bg-red-500": null} relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80transition w-full
      ${label === "Remove from Favorites" ? "bg-red-500" : "null"}
       ${outline ? "bg-white" : "bg-green-600"} ${
        outline
          ? "border-black"
          : label === "Remove from Favorites"
          ? null
          : "border-green-600"
      } ${outline ? "text-black" : "text-white"} ${small ? "py-1" : "py-3"} ${
        small ? "text-sm" : "text-md"
      } ${small ? "font-light" : "font-semibold"} ${
        small ? "border-[1px]" : "border-2"
      }`}
    >
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {label}
    </button>
  );
};
