import { Heading } from "@/components/Heading";
import LargeCard from "@/components/LargeCard";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useState } from "react";

const Trips = ({ listings }) => {
  const [tripsType, setTripsType] = useState("upcoming");
  function toggleTrips() {
    if (tripsType === "upcoming") setTripsType("past");
    else setTripsType("upcoming");
  }
  return (
    <>
      <Head>
        <title>Your Trips - faaho.com</title>
        <meta
          name="description"
          content="View and manage your travel reservations on Faaho."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="trips, reservations, travel, manage trips, upcoming trips, past trips"
        />
      </Head>
      <main className="m-3 items-center flex flex-col">
        <div className="flex items-start w-full mt-5">
          <Heading
            title={"Your upcoming and past trips"}
            subtitle={"View and manage your travel reservations"}
          />
        </div>
        {/* Main container div */}
        <div className="mt-5 w-full flex flex-col items-center">
          {/* UPCOMING TRIPS DIV */}
          <div className="flex items-start w-full gap-3 mb-3">
            <span
              onClick={toggleTrips}
              className={`${
                tripsType === "upcoming" ? "text-black" : "text-neutral-400"
              }`}
            >
              Upcoming trips
            </span>
            <span>|</span>
            <span
              onClick={toggleTrips}
              className={`${
                tripsType === "past" ? "text-black" : "text-neutral-400"
              }`}
            >
              Past trips
            </span>
          </div>
          <hr />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-10 mt-5">
            {listings.reverse().map((listing) => {
              return (
                <LargeCard
                  key={listing.listingId}
                  listingId={listing.listingId}
                  images={listing.images}
                  name={listing.name}
                  category={listing.category}
                  price={listing.totalPrice}
                  adultCount={listing.adultCount}
                  authorId={listing.authorId}
                  roomCount={listing.roomCount}
                  childCount={listing.childCount}
                  landmark={listing.landmark}
                  lat={listing.lat}
                  lng={listing.lng}
                  location={listing.location}
                  street={listing.street}
                  favoritesPage={false}
                  reservation={listing}
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Trips;

export async function getServerSideProps(context) {
  const { userId } = context.params;
  // ? fetching all the reservations of a user
  const qReservation = query(
    collection(db, "reservations"),
    where("userId", "==", userId)
  );
  const reservationsSnap = await getDocs(qReservation);
  const reservations = reservationsSnap.docs.map((doc) => {
    const reservationData = doc.data();
    reservationData.startDate = reservationData.startDate
      .toDate()
      .toISOString();
    reservationData.endDate = reservationData.endDate.toDate().toISOString();
    reservationData.timestamp = reservationData.timestamp.toDate().toString();
    return reservationData;
  });

  // ? listing getter function
  async function getListingWithId(listingId, startDate, endDate, totalPrice) {
    const listingSnap = await getDoc(doc(db, "listings", listingId));
    const listing = listingSnap.data();
    // ? converting the timstamp to a string
    listing.timestamp = listing.timestamp.toDate().toString();
    listing.totalPrice = totalPrice;
    listing.endDate = endDate;
    listing.startDate = startDate;
    listing.listingId = listingId;
    return listing;
  }

  // ? fetching all the listings of the user from the reservations data
  const listingPromises = reservations.map((reservation) =>
    getListingWithId(
      reservation.listingId,
      reservation.startDate,
      reservation.endDate,
      reservation.totalPrice
    )
  );
  const listings = await Promise.all(listingPromises);
  return {
    props: {
      listings,
    },
  };
}
