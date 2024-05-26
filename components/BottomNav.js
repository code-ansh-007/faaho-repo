import React, { useEffect, useState } from "react";
import { BiSearch, BiUserCircle } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";
import { motion, useScroll } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";

const BottomNav = () => {
  const [page, setPage] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);

  const { data: session } = useSession();

  // ? SHOW HIDE OF THE NAVBAR, LOGIC
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollPosition > prevScrollPosition) {
        setShowNav(false);
      } else if (currentScrollPosition < prevScrollPosition) {
        setShowNav(true);
      }

      setPrevScrollPosition(currentScrollPosition);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPosition]);

  // ? ROUTER FOR NAVIGATION
  const router = useRouter();

  return (
    <>
      {showNav && (
        <motion.main
          transition={{ y: "-100vh" }}
          className={`flex fixed bottom-0 bg-white w-full z-50 justify-center p-3 space-x-10 border-t-[1px] border-gray-300`}
        >
          <div
            onClick={() => {
              router.push("/");
              setPage(1);
            }}
            className="flex flex-col items-center text-gray-400"
          >
            <BiSearch
              className={`text-3xl ${page === 1 ? "text-green-600" : null}`}
            />
            <span className="text-xs">Explore</span>
          </div>
          <div
            onClick={() => {
              router.push("/favorites");
              setPage(2);
            }}
            className="flex flex-col items-center text-gray-400"
          >
            <AiOutlineHeart
              className={`text-3xl ${page === 2 ? "text-green-600" : null}`}
            />
            <span className="text-xs">Favorites</span>
          </div>
          <div
            onClick={() => {
              if (session) router.push("/userAccount");
              else router.push("/auth/signin");
              setPage(3);
            }}
            className="flex flex-col items-center text-gray-400"
          >
            {session && session.user.image ? (
              <div>
                <Image
                  src={session.user.image}
                  width={30}
                  height={30}
                  className="rounded-full mb-[1px]"
                />
              </div>
            ) : (
              <BiUserCircle
                className={`text-3xl ${page === 3 ? "text-green-600" : null}`}
              />
            )}
            {session ? (
              <span className="text-xs">Account</span>
            ) : (
              <span className="text-xs">Login</span>
            )}
          </div>
        </motion.main>
      )}
    </>
  );
};

export default BottomNav;
