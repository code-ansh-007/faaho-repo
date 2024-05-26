export const Heading = ({ title, subtitle, center }) => {
  return (
    <div className={`${center ? "text-center" : "text-start"}`}>
      <div className="text-xl font-semibold">{title}</div>
      <div className="font-light text-neutral-500 mt-1 text-sm">{subtitle}</div>
    </div>
  );
};
