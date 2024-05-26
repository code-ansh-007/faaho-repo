import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect } from "react";
import { Link } from "react-scroll";

const CityCategoryBox = ({
  name,
  img,
  setSearchResults,
  setSearchLoading,
  searchResults,
}) => {
  useEffect(() => {
    console.log("fethched listings");
  }, [searchResults]);

  const fetchListingsWithCity = async () => {
    setSearchLoading(true);
    try {
      const querySnap = await getDocs(collection(db, "listings"));
      const listings = querySnap.docs.map((doc) => {
        const listing = doc.data();
        const listingId = doc.id;
        listing.listingId = listingId;
        listing.timestamp = listing.timestamp.toDate().toString();
        return listing;
      });
      const cityName = name.toLowerCase();
      const filteredListings = listings.filter((listing) => {
        let matchesCriteria = true;
        if (!listing.location.toLowerCase().includes(cityName)) {
          matchesCriteria = false;
        }
        return matchesCriteria;
      });
      setSearchResults(filteredListings);
    } catch (error) {
      console.log("Error fetching listings with city!", error);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <Link to="searchDiv" smooth={true} duration={700} offset={-150}>
      <div
        className="rounded-md text-center w-[150px] h-[125px] md:w-[300px] md:h-[250px] relative active:scale-110 transition transform duration-300"
        onClick={fetchListingsWithCity}
      >
        <Image
          src={img}
          layout="fill"
          objectFit="cover"
          className="rounded-md opacity-70"
        />
        <span className="font-bold text-2xl absolute left-3 bottom-1 text-white">
          {name}
        </span>
      </div>
    </Link>
  );
};

export default CityCategoryBox;
