import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const Modal = ({ body, title, close }) => {
  return (
    <main className="flex flex-col items-center justify-center h-full fixed inset-0 z-50 w-full bg-black bg-opacity-50">
      <div className="bg-white relative w-full h-full md:w-[400px] md:h-[560px] overflow-y-scroll p-4 rounded-xl">
        {/* Header */}
        <div className=" flex items-center justify-between pb-3">
          <span className="font-semibold">{title}</span>
          <MdOutlineClose size={24} onClick={close} />
        </div>
        <hr />
        <div className="mt-5">{body}</div>
      </div>
    </main>
  );
};

export default Modal;
