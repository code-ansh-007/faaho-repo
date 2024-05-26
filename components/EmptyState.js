import { useRouter } from "next/router";
import { Heading } from "./Heading";
import { Button } from "./Button";

const EmptyState = ({
  title = "No exact matches",
  subtitle = "Try modifying your filters",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div className=" h-[60vh] flex flex-col justify-center items-center ">
      <Heading title={title} subtitle={subtitle} center />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label={"Remove all filters"}
            onClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
