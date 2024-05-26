import React, { useState, useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import HeartButton from "./HeartButton";

const Slider = ({
  children: slides,
  autoSlide = false,
  autoSlideInterval = 3000,
  listingId,
  favoritesPage,
}) => {
  const [curr, setCurr] = useState(0);
  const slideWidth = 100 / slides.length;
  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  // AUTO SLIDE FEATURE
  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);

  const handleControlClick = (e) => {
    e.stopPropagation(); // ? very important piece of code, this is responsible for not redirecting the user to the individual listing page when the user clicks on the navigation buttons on the slider component, this was a bug which i was facing since the inception of this project now because of this function this has been handled, a lesson learned well, CHAT GPT zinda baad!
  };

  return (
    <>
      <div className="overflow-hidden relative flex">
        <div
          className="flex transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${curr * slideWidth}%)` }}
        >
          {slides}
        </div>
        <div className="absolute inset-0 items-center flex justify-between p-4">
          <button
            onClick={(e) => {
              prev();
              handleControlClick(e);
            }}
            className="rounded-full outline-none hover:opacity-100 p-1 bg-white opacity-80"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={(e) => {
              next();
              handleControlClick(e);
            }}
            className="rounded-full outline-none hover:opacity-100 p-1 bg-white opacity-80"
          >
            <FaChevronRight />
          </button>
        </div>
        {/* INDICATOR SECTION */}
        <div className="absolute bottom-4 right-0 left-0">
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, i) => {
              return (
                <div
                  key={i}
                  onClick={() => setCurr(i)}
                  className={`transition-all w-2 h-2 bg-white rounded-full ${
                    curr === i ? "p-[6px]" : "bg-opacity-50"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {!favoritesPage && (
          <div className="absolute top-5 right-5">
            <HeartButton listingId={listingId} />
          </div>
        )}
      </div>
    </>
  );
};

export default Slider;
