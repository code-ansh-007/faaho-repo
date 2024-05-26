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

const ReservationsPage = ({ listings }) => {
  return (
    <>
      <Head>
        <title>Your Reservations - faaho.com</title>
        <meta
          name="description"
          content="Manage the reservations on your properties made by the users on faaho.com."
        />
      </Head>
      <main className="m-5">
        <Heading
          title={"Your Reservations"}
          subtitle={
            "Manage the reservations on your properties made by the users"
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 mt-5 place-items-center">
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
      </main>
    </>
  );
};

export default ReservationsPage;

export async function getServerSideProps(context) {
  const { authorId } = context.params;
  const qReservations = query(
    collection(db, "reservations"),
    where("authorId", "==", authorId)
  );
  const reservationsSnap = await getDocs(qReservations);
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
