import React from "react";
import { Heading } from "./Heading";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const InfoRegister = ({ title, subtitle, value, setterFunction }) => {
  return (
    <div className="flex items-center justify-between">
      <Heading title={title} subtitle={subtitle} />
      <div className="flex items-center gap-3">
        <div className="border-[1px] border-black rounded-full p-1">
          <AiOutlineMinus
            size={24}
            onClick={() => {
              if (value === 1 || value < 0 || value === 0) return;
              setterFunction(value - 1);
            }}
          />
        </div>
        <span className="text-xl">{value}</span>
        <div className="border-[1px] border-black rounded-full p-1">
          <AiOutlinePlus size={24} onClick={() => setterFunction(value + 1)} />
        </div>
      </div>
    </div>
  );
};

export default InfoRegister;
