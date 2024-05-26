import { BsStars } from "react-icons/bs";

export const MenuItem = ({ onClick, label }) => {
  return (
    <div
      onClick={onClick}
      className={`hover:bg-gray-100 rounded-md p-1 text-sm font-semibold text-gray-700 ${
        label === "Log Out"
          ? "bg-red-500 rounded-md w-fit text-white px-3 hover:bg-red-300"
          : null
      }`}
    >
      {label === "List Property" ? (
        <div className="flex flex-row items-center space-x-2">
          <span>{label}</span>
          <BsStars className="text-green-600 animate-pulse" />
        </div>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
};
