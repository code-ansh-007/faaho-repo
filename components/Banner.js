import React, { useEffect, useState } from "react";
import bed from "@/public/assets/double-bed.png";
import building from "@/public/assets/building.png";
import pg from "@/public/assets/pg.png";
import house from "@/public/assets/house.png";
import plot from "@/public/assets/plots.png";
import building2 from "@/public/assets/building2.png";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";
import { MenuItem } from "./MenuItem";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { useCreateModal } from "@/recoil/useCreateModal";
import { signOut, useSession } from "next-auth/react";
import { FaUmbrellaBeach } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { FaPhone } from "react-icons/fa";

export const categories = [
  {
    label: "Hotels",
    iconImg: "/assets/double-bed.png",
    description: "This is a hotel",
  },
  {
    label: "Apartments",
    iconImg: "/assets/building.png",
    description: "This is an apartment",
  },
  {
    label: "PGs",
    iconImg: "/assets/pg.png",
    description: "This is a PG",
  },
  {
    label: "Rental House",
    iconImg: "/assets/house.png",
    description: "This is a rental house",
  },
  {
    label: "Plots",
    iconImg: "/assets/plots.png",
    description: "This is a plot",
  },
  {
    label: "Buildings",
    iconImg: "/assets/building2.png",
    description: "This is a building",
  },
];

const Banner = ({ setCat }) => {
  const [category, setCategory] = useState("hotels");
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useRecoilState(useCreateModal);
  const { data: user } = useSession();

  useEffect(() => {
    setCat("Hotels");
  }, []);

  return (
    <>
      <main className="w-full flex flex-col items-start md:flex-row md:items-center h-fit py-2 justify-between bg-white shadow-md z-30 fixed top-0">
        {/* BRAND DIV */}
        <div className="ml-3">
          <Link href={"/"}>
            <Image
              src={"/assets/logo.png"}
              width={80}
              height={80}
              alt="logo of faaho.com"
            />
          </Link>
        </div>
        {/* CATEGORIES DIV */}
        <div className="flex overflow-x-scroll md:gap-5 gap-4 px-5 pb-3 mt-3 w-full">
          <ScrollLink to="hookDiv" smooth={true} duration={700} offset={-15}>
            <div
              onClick={() => {
                setCategory("hotels");
                setCat("Hotels");
              }}
              className={`flex flex-col md:flex-row items-center gap-2 ${
                category == "hotels" ? "border-b-2 border-green-500 pb-1" : null
              }`}
            >
              <Image src={bed} width={20} alt="category pics" />
              <span className="text-sm font-semibold text-gray-600">
                Hotels
              </span>
            </div>
          </ScrollLink>
          <ScrollLink to="hookDiv" smooth={true} duration={700} offset={-15}>
            <div
              onClick={() => {
                setCategory("apartments");
                setCat("Apartments");
              }}
              className={`flex flex-col md:flex-row items-center gap-2 ${
                category == "apartments"
                  ? "border-b-2 border-green-500 pb-1"
                  : null
              }`}
            >
              <Image src={building} width={20} alt="category pics" />

              <span className="text-sm font-semibold text-gray-600">
                Apartments
              </span>
            </div>
          </ScrollLink>
          <ScrollLink to="hookDiv" smooth={true} duration={700} offset={-15}>
            <div
              onClick={() => {
                setCategory("pgs");
                setCat("PGs");
              }}
              className={`flex flex-col gap-3 md:flex-row items-center md:gap-1 ${
                category == "pgs" ? "border-b-2 border-green-500 pb-1" : null
              }`}
            >
              <Image src={pg} width={20} alt="category pics" />
              <span className="text-xs font-semibold text-gray-600">PGs</span>
            </div>
          </ScrollLink>
          <ScrollLink to="hookDiv" smooth={true} duration={700} offset={-15}>
            <div
              onClick={() => {
                setCategory("rentalhouse");
                setCat("Rental House");
              }}
              className={`flex flex-col md:flex-row items-center gap-2 ${
                category == "rentalhouse"
                  ? "border-b-2 border-green-500 pb-1"
                  : null
              }`}
            >
              <Image src={house} width={20} alt="category pics" />
              <span className="text-sm font-semibold text-gray-600 truncate">
                Rental House
              </span>
            </div>
          </ScrollLink>
          <ScrollLink to="hookDiv" smooth={true} duration={700} offset={-15}>
            <div
              onClick={() => {
                setCategory("plots");
                setCat("Plots");
              }}
              className={`flex flex-col md:flex-row items-center gap-2 ${
                category == "plots" ? "border-b-2 border-green-500 pb-1" : null
              }`}
            >
              <Image src={plot} width={20} alt="category pics" />
              <span className="text-sm font-semibold text-gray-600">Plots</span>
            </div>
          </ScrollLink>
          <ScrollLink to="hookDiv" smooth={true} duration={700} offset={-15}>
            <div
              onClick={() => {
                setCategory("buildings");
                setCat("Buildings");
              }}
              className={`flex flex-col md:flex-row items-center gap-2 ${
                category == "buildings"
                  ? "border-b-2 border-green-500 pb-1"
                  : null
              }`}
            >
              <Image src={building2} width={20} alt="category pics" />
              <span className="text-sm font-semibold text-gray-600">
                Buildings
              </span>
            </div>
          </ScrollLink>
        </div>
        <div className="flex flex-row items-center gap-4">
          {/* HIGHLIGHT OF THE NAVBAR */}
          <button
            onClick={() => {
              if (!user) {
                router.push("/auth/signin");
              } else {
                setShowCreateModal(true);
              }
            }}
            className="md:flex flex-row outline-none hidden items-center gap-2 relative border-green-300 border-[1.5px] px-3 py-1 rounded-lg bg-green-100 text-green-600"
          >
            <FaUmbrellaBeach />
            <span className="text-sm flex-1">List Your Property</span>
            <BsStars className="text-yellow-500 absolute top-[-10px] right-[-10px] text-xl animate-pulse" />
          </button>
          <div className="flex flex-row items-center gap-1 text-sm md:static absolute top-5 right-16">
            <span>
              <FaPhone className="rotate-90" />
            </span>
            <a href="tel:+91 99880 00664">Contact Us</a>
          </div>
          {/* MENU BUTTON */}
          <span className="mr-3 absolute top-2 right-0 md:static">
            <FiMenu
              onClick={() => setOpenMenu(!openMenu)}
              size={40}
              className=" border-[1px] border-gray-200 shadow-lg rounded-full p-2 text-green-600"
            />
          </span>
          {openMenu &&
            (user ? (
              <div className="absolute top-14 rounded-xl shadow-md w-[150px] flex flex-col gap-2 right-4 bg-white p-2">
                <MenuItem
                  onClick={() => router.push(`/trips/${user?.user?.id}`)}
                  label={"My Trips"}
                />
                <MenuItem
                  onClick={() => router.push("/favorites")}
                  label={"My Favorites"}
                />
                <MenuItem
                  onClick={() => router.push(`/reservations/${user?.user?.id}`)}
                  label={"My Reservations"}
                />
                <MenuItem
                  onClick={() => router.push(`/properties/${user?.user?.id}`)}
                  label={"My Properties"}
                />
                <MenuItem
                  onClick={() => setShowCreateModal(true)}
                  label={"List Property"}
                />
                <hr />
                <MenuItem label={"Log Out"} onClick={signOut} />
              </div>
            ) : (
              <div className="absolute top-14 rounded-xl shadow-md w-[150px] flex flex-col gap-2 right-4 bg-white p-2">
                <MenuItem
                  onClick={() => router.push("/auth/signin")}
                  label={"Login"}
                />
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export default Banner;
