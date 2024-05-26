import React from "react";
import { Button } from "./Button";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { useCreateModal } from "@/recoil/useCreateModal";
import { useRouter } from "next/router";

const Footer = () => {
  const { data: user } = useSession();
  const [showCreateModal, setShowCreateModal] = useRecoilState(useCreateModal);
  const router = useRouter();
  return (
    <footer className="mt-10">
      <div className="bg-gray-200 p-4 flex flex-col items-center gap-4">
        <button
          onClick={() => {
            if (user) {
              setShowCreateModal(true);
            } else {
              router.push("/auth/signin");
            }
          }}
          className="bg-green-500 rounded-lg px-3 py-1 text-white font-semibold"
        >
          List Your Property
        </button>
        <hr className="border-[1px] border-gray-400 w-full" />
        <div className="text-sm flex flex-col gap-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <span className="font-bold underline">Terms & Conditions</span>
            <span className="font-bold underline">About Faaho.com</span>
            <span className="font-bold underline">Explore Hotels</span>
            <span className="font-bold underline">Explore Apartments</span>
            <span className="font-bold underline">Explore Apartments</span>
            <span className="font-bold underline">Explore PGs</span>
            <span className="font-bold underline">Explore Rental House</span>
            <span className="font-bold underline">Explore Plots</span>
            <span className="font-bold underline">Explore Buildings</span>
          </div>
          <span className="">
            &copy; Copyright Faaho.com&trade;. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
