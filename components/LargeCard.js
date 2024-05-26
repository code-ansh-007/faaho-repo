import Image from "next/image";
import React, { useMemo } from "react";
import Slider from "./Slider";
import { useRouter } from "next/router";
import { Button } from "./Button";
import { format } from "date-fns";
import capitalizeEachWord from "@/utils/capitalizeEachWord";

const LargeCard = ({
  listingId,
  images,
  name,
  rating,
  category,
  price: listingPrice, // ? this price for not represents the total price of the listing during or before booking will update the logic later
  threeHoursPrice,
  sixHoursPrice,
  twelveHoursPrice, // ? these prices are for hotels and rental houses
  nightlyPrice, //?  this price is also only for hotels and rental houses
  monthlyPrice, // ?  this is only for PGs and Apartments
  desc,
  authorId, // ? start from here after recent update
  roomCount,
  adultCount,
  childCount,
  landmark,
  lat,
  lng,
  location,
  street,
  favoritesPage,
  removeFavoriteFunc,
  reservation,
  proposedPrice,
}) => {
  // ? FETCHING THE PRICE FROM THE RESERVATION OBJECT
  const price = useMemo(() => {
    if (reservation) return reservation.totalPrice;
    else return listingPrice;
  }, [reservation]);

  // ? FETCHING THE DATE RANGE FROM THE RESERVATION OBJECT
  const reservationDateRange = useMemo(() => {
    if (!reservation) return null;
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  const router = useRouter();
  function passDetails() {
    router.push({
      pathname: `/room/${listingId}`,
      query: {
        name,
        rating,
        category,
        price,
        threeHoursPrice,
        sixHoursPrice,
        twelveHoursPrice,
        monthlyPrice,
        nightlyPrice,
        desc,
        images,
        listingId,
        authorId,
        roomCount,
        adultCount,
        childCount,
        landmark,
        lat,
        lng,
        location,
        street,
      },
    });
  }

  const handleRemoveFavorite = (event) => {
    event.stopPropagation(); // Prevent click event from propagating to the parent div
    removeFavoriteFunc(listingId);
  };

  return (
    <div
      onClick={passDetails}
      className="flex flex-col space-y-2 mb-10 max-w-xs"
    >
      {/* SLIDER DIV */}
      <Slider listingId={listingId} favoritesPage={favoritesPage}>
        {images?.map((item) => {
          return (
            <div
              key={item}
              className="relative w-80 h-80"
              style={{ cursor: "pointer" }}
            >
              <Image
                src={item}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="rounded-2xl"
                alt="room pics"
              />
            </div>
          );
        })}
      </Slider>
      {/* DETAILS DIV */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold ml-1">{capitalizeEachWord(name)}</span>
        </div>
        <p
          className={`${
            reservation ? "text-lg" : "text-sm"
          } w-80 ml-1 text-neutral-500`}
        >
          <span className="text-black">{reservation ? "Duration: " : ""}</span>
          {reservationDateRange || desc}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm ml-1">
            ₹
            {reservation
              ? price
              : category == "Plots" || category == "Buildings"
              ? proposedPrice // ? this price is the price which was decided during the reservation time
              : category === "Hotels" || category === "Rental House"
              ? nightlyPrice + "/night"
              : monthlyPrice + "/monthly"}
          </span>
          <span className="text-green-800 bg-green-300 text-sm mr-2 rounded-lg px-3 py-1 font-bold">
            {category}
          </span>
        </div>
      </div>
      {favoritesPage && (
        <Button
          onClick={handleRemoveFavorite}
          label={"Remove from Favorites"}
          small
        />
      )}
    </div>
  );
};

export default LargeCard;
