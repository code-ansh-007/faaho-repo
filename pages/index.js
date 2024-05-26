import Banner from "@/components/Banner";
import LargeCard from "@/components/LargeCard";
import Head from "next/head";
import BottomNav from "@/components/BottomNav";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { BiLoaderAlt } from "react-icons/bi";
import CreateModal from "@/components/modals/CreateModal";
import { useRecoilState } from "recoil";
import { useCreateModal } from "@/recoil/useCreateModal";
import SuperHeader from "@/components/SuperHeader";
import { Element } from "react-scroll";
import Image from "next/image";
import CityCategoryBox from "@/components/CityCategoryBox";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [cat, setCat] = useState("Hotels");
  const [showCreateModal, setShowCreateModal] = useRecoilState(useCreateModal);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, "listings"),
        where("category", "==", cat),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setListings(snapshot.docs);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [cat]);

  return (
    <>
      <Head>
        <title>Faaho.com - Find Your Perfect Accommodation</title>
        <meta
          name="description"
          content="Discover and book hotels, PGs, apartments, rental houses, plots, and buildings on Faaho.com. Find the perfect accommodation for your needs."
        />
        <meta
          name="keywords"
          content="Faaho, accommodations, hotels, PGs, apartments, rental houses, plots, buildings, travel, booking"
        />
      </Head>
      <main className={`flex flex-col items-center overflow-x-hidden`}>
        <Banner setCat={setCat} />
        <SuperHeader
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          setSearchLoading={setSearchLoading}
        />
        {searchResults.length > 0 && (
          <div className="mt-32 w-full">
            <Element
              name="searchDiv"
              id="searchDiv"
              className="md:mt-7 mt-8 w-full"
            >
              <span className="text-start w-full md:ml-[120px] ml-5 text-2xl font-semibold">
                Search Results
              </span>
            </Element>
            {searchLoading ? (
              <BiLoaderAlt className="text-7xl text-green-500 animate-spin mt-[370px]" />
            ) : (
              <div className="mt-5 md:ml-24 ml-5 sm:px-8 sm:grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {searchResults.map((listing) => {
                  return (
                    <LargeCard
                      key={listing.listingId}
                      listingId={listing.listingId}
                      images={listing.images}
                      name={listing.name}
                      category={listing.category}
                      price={listing.price}
                      // ! below is the pricing attributes for all the kinds of properties
                      threeHoursPrice={listing.threeHoursPrice}
                      sixHoursPrice={listing.sixHoursPrice}
                      twelveHoursPrice={listing.twelveHoursPrice}
                      nightlyPrice={listing.nightlyPrice}
                      monthlyPrice={listing.monthlyPrice}
                      // ! above is the pricing attributes for all kinds of properties
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
                      favoritesPage={false}
                      proposedPrice={listing.price}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className="md:mt-40 mt-36 w-full">
          <span className="text-start w-full md:ml-[120px] ml-[20px] text-2xl font-semibold ">
            Browse Cities
          </span>
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-2 md:grid-cols-3 mt-4 md:gap-10 gap-4 justify-center items-center">
              <CityCategoryBox
                name={"Jalandhar"}
                img={"/assets/jalandhar-icon.jpg"}
                setSearchResults={setSearchResults}
                setSearchLoading={setSearchLoading}
              />
              <CityCategoryBox
                name={"Phagwara"}
                img={"/assets/phagwara-icon.jpg"}
                setSearchResults={setSearchResults}
                setSearchLoading={setSearchLoading}
              />
              <CityCategoryBox
                name={"Amritsar"}
                img={"/assets/amritsar-icon.jpg"}
                setSearchResults={setSearchResults}
                setSearchLoading={setSearchLoading}
              />
            </div>
          </div>
        </div>

        <Element name="hookDiv" id="hookDiv" className="md:mt-7 mt-8 w-full">
          <span className="text-start w-full ml-[15px] md:ml-[120px] text-2xl font-semibold">
            {cat == "Hotels"
              ? "Explore Hotels"
              : cat == "PGs"
              ? "Explore PGs"
              : cat == "Apartments"
              ? "Explore Apartments"
              : cat == "Rental House"
              ? "Explore Rental Houses"
              : cat == "Plots"
              ? "Explore Plots"
              : "Explore Buildings"}
          </span>
        </Element>
        {loading ? (
          <BiLoaderAlt className="text-7xl text-green-500 animate-spin mt-[370px]" />
        ) : (
          <div className="mt-10 sm:px-8 sm:grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {listings.map((listing) => {
              return (
                <LargeCard
                  key={listing.id}
                  listingId={listing.id}
                  images={listing.data().images}
                  name={listing.data().name}
                  category={listing.data().category}
                  price={listing.data().price}
                  // ! below is the pricing attributes for all the kinds of properties
                  threeHoursPrice={listing.data().threeHoursPrice}
                  sixHoursPrice={listing.data().sixHoursPrice}
                  twelveHoursPrice={listing.data().twelveHoursPrice}
                  nightlyPrice={listing.data().nightlyPrice}
                  monthlyPrice={listing.data().monthlyPrice}
                  // ! above is the pricing attributes for all kinds of properties
                  desc={listing.data().desc}
                  adultCount={listing.data().adultCount}
                  authorId={listing.data().authorId}
                  roomCount={listing.data().roomCount}
                  childCount={listing.data().childCount}
                  landmark={listing.data().landmark}
                  lat={listing.data().lat}
                  lng={listing.data().lng}
                  location={listing.data().location}
                  street={listing.data().street}
                  favoritesPage={false}
                  proposedPrice={listing.data().price}
                />
              );
            })}
          </div>
        )}
        <BottomNav />
        {showCreateModal && <CreateModal />}
      </main>
    </>
  );
}
