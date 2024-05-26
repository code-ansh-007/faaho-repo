import { BiRupee } from "react-icons/bi";

export const Input = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  required,
  setterFunction,
  value,
  description,
}) => {
  const handleChange = (e) => {
    // If type is "tel", enforce 10 digit input
    if (type === "tel") {
      const inputValue = e.target.value;
      const regex = /^\d{0,10}$/; // Regular expression to match 10 digits
      if (regex.test(inputValue)) {
        setterFunction(inputValue);
      }
    } else {
      setterFunction(e.target.value);
    }
  };
  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiRupee size={24} className="text-neutral-700 absolute top-5 left-2" />
      )}
      <input
        type={type}
        id={id}
        disabled={disabled}
        required={required}
        value={value}
        onChange={handleChange}
        placeholder={description}
        className={`peer p-4 w-full pt-6 font-light bg-white border-2 text-sm rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${
          formatPrice ? "pl-9" : "pl-4"
        }`}
      />
      <label
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 text-sm z-10 origin-[0] ${
          formatPrice ? "left-9" : "left-4"
        }
        peer-placeholder-shown:scale-100
        peer-placeholder-showm:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
      `}
      >
        {label}
      </label>
    </div>
  );
};
