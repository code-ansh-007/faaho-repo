import { Heading } from "@/components/Heading";
import LargeCard from "@/components/LargeCard";
import { db } from "@/firebase";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import Head from "next/head";

const Favorites = ({ listings }) => {
  const router = useRouter();
  const { data: session } = useSession();

  async function removeFavorite(id) {
    const q = query(
      collection(db, "users"),
      where("userId", "==", session.user.id)
    );
    const userSnap = await getDocs(q);
    const userRef = userSnap.docs[0].ref;
    await updateDoc(userRef, {
      favIds: arrayRemove(id),
    }).then(() => {
      listings = listings.filter((item) => item.id !== id);
      router.reload();
      toast("Removed from favorites ✅");
    });
  }

  return (
    <>
      <Head>
        <title>Your Favorites - faaho.com</title>
        <meta
          name="description"
          content="Manage your favorite travel destinations on Faaho."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="favorites, favorite destinations, manage favorites, saved places, travel, trips, Faaho"
        />
      </Head>
      <main className="px-4 mt-10 pb-10">
        <div className="absolute">
          <ToastContainer
            position="top-center"
            autoClose={2500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
        {listings.length === 0 && session ? (
          <EmptyState
            title="No Favorites"
            subtitle="Looks like you have'nt favorited any place"
          />
        ) : session ? (
          <div>
            <div className="mb-5">
              <Heading
                title={"Your Favorites"}
                subtitle={"You can manage your favorites from here"}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              {listings.map((listing) => {
                return (
                  <LargeCard
                    key={listing.id}
                    listingId={listing.id}
                    images={listing.images}
                    name={listing.name}
                    rating={listing.rating}
                    category={listing.category}
                    price={listing.price}
                    desc={listing.desc}
                    adultCount={listing.adultCount}
                    authorId={listing.authorId}
                    roomCount={listing.roomCount}
                    childCount={listing.childCount}
                    landmark={listing.landmark}
                    lat={listing.lat}
                    lng={listing.lng}
                    location={listing.location}
                    street={listing.street}
                    favoritesPage={true}
                    removeFavoriteFunc={removeFavorite}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start space-y-2 mt-7">
            <Heading
              title={"Login to view your saved destinations"}
              subtitle={"You can manage your favorites from here"}
            />
            <button
              onClick={() => router.push("/auth/signin")}
              className="bg-green-300 border-2 border-green-600 text-green-600 font-semibold py-1 px-4 active:scale-105 transition transform duration-150 rounded-md"
            >
              Login
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default Favorites;

export async function getServerSideProps(context) {
  const user = await getSession(context);
  if (!user)
    return {
      props: {
        listings: [],
      },
    };
  const q = query(collection(db, "users"), where("userId", "==", user.user.id));
  const userSnap = await getDocs(q);
  const userData = userSnap.docs[0];
  const favIds = userData.data().favIds;
  let listings = [];

  for (let i = 0; i < favIds.length; i++) {
    const listingSnap = await getDoc(doc(db, "listings", favIds[i]));
    const listing = { ...listingSnap.data(), id: favIds[i] };
    listings.push(listing);
  }
  const jsonListingData = JSON.parse(JSON.stringify(listings));
  return {
    props: {
      listings: jsonListingData,
    },
  };
}
