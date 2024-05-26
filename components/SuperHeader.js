import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays } from "date-fns";
import Dropdown from "./Dropdown";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { useCreateModal } from "@/recoil/useCreateModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function SuperHeader({ setSearchLoading, setSearchResults, searchResults }) {
  const [stayType, setStayType] = useState("hours");
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [showDays, setShowDays] = useState(false);
  const [adults, setAdults] = useState(1); // *
  const [children, setChildren] = useState(0); // *
  // ? below are the latest seach parameters as suggested by the client
  const [rooms, setRooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [washrooms, setWashrooms] = useState(1);
  const [showStayType, setShowStayType] = useState(false);
  const [category, setCategory] = useState("Hotels"); // *
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    console.log("fetched listings");
  }, [searchResults]);

  const handleSearch = async () => {
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
      const filteredListings = listings.filter((listing) => {
        let matchesCriteria = true;
        // ? category check
        if (listing.category !== category) {
          matchesCriteria = false;
        }
        // ? adult count
        if (listing.adultCount < adults) {
          matchesCriteria = false;
        }
        // ? child count
        if (listing.childCount < children) {
          matchesCriteria = false;
        }
        // ? property name or location of property filter check
        if (searchText) {
          const searchTextLower = searchText.toLowerCase();
          matchesCriteria =
            listing.name.toLowerCase().startsWith(searchTextLower) ||
            listing.location.toLowerCase().startsWith(searchTextLower);
        }
        return matchesCriteria;
      });
      setSearchResults(filteredListings);
    } catch (error) {
      console.log("Error fetching listings: ", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const [showCreateModal, setShowCreateModal] = useRecoilState(useCreateModal);
  const { data: user } = useSession();
  const router = useRouter();

  const options = [
    {
      value: 1,
      label: 1,
    },
    {
      value: 2,
      label: 2,
    },
    {
      value: 3,
      label: 3,
    },
  ];

  const handleStayTypeChange = (e) => {
    setStayType(e.target.value);
  };

  function calculateDays(startDate, endDate) {
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);

    const daysDiff = differenceInDays(endDateObject, startDateObject);
    return daysDiff + 1;
  }

  const filterPassedDate = (date) => {
    return checkInDate ? date >= checkInDate : false;
  };

  useEffect(() => {
    if (category == "Hotels" || category == "Rental House")
      setShowStayType(true);
    else {
      setShowStayType(false);
    }
  }, [category]);

  return (
    <div className="w-full relative">
      <span className="absolute top-40 md:top-24 text-2xl font-bold text-white left-5 md:left-32">
        Faaho.com Welcomes You!
      </span>
      {/* Search Component */}
      <div className="absolute md:top-[160px] top-[210px] left-4 w-[330px] md:w-auto md:left-32 bg-white p-3 rounded-lg flex flex-col gap-6 shadow-md pb-10">
        {/* Category selection section */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-gray-500">Category</span>
          <div className="flex flex-row items-center gap-3 md:gap-7">
            <div className="flex flex-row items-center text-sm gap-1">
              <input
                type="radio"
                className="h-4 w-4"
                name="categories"
                checked={category == "Hotels"}
                value="Hotels"
                onChange={(e) => setCategory(e.target.value)}
              />
              <span>Hotel</span>
            </div>
            <div className="flex flex-row items-center text-sm gap-1">
              <input
                type="radio"
                className="h-4 w-4"
                name="categories"
                checked={category == "Apartments"}
                value="Apartments"
                onChange={(e) => setCategory(e.target.value)}
              />
              <span>Apartments</span>
            </div>
            <div className="flex flex-row items-center text-sm gap-1">
              <input
                type="radio"
                className="h-4 w-4"
                name="categories"
                checked={category == "PGs"}
                value="PGs"
                onChange={(e) => setCategory(e.target.value)}
              />
              <span>PGs</span>
            </div>
            <div className="flex flex-row items-center text-sm gap-1">
              <input
                type="radio"
                className="h-6 w-6 md:h-4 md:w-4"
                name="categories"
                checked={category == "Rental House"}
                value="Rental House"
                onChange={(e) => setCategory(e.target.value)}
              />
              <span className="">Rental House</span>
            </div>
          </div>
        </div>
        {/* Area search input box */}
        <div className="flex flex-col">
          <label htmlFor="searchInput" className="font-semibold text-gray-500">
            Where would you like to stay ?
          </label>
          <input
            type="text"
            className="border-b-[1px] outline-none border-gray-300 text-sm"
            placeholder="e.g. area name, locality etc."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {/* By hours or days selection div */}
        {showStayType && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-500">
                Stay in (
                <span className="text-sm font-normal italic">
                  Select, if you want to stay in hours or in days
                </span>
                )
              </span>
              <div className="flex flex-row items-center gap-3">
                <div className="flex flex-row items-center text-sm gap-1">
                  <input
                    type="radio"
                    className="h-4 w-4"
                    name="stayTime"
                    checked={stayType == "hours"}
                    value="hours"
                    onChange={handleStayTypeChange}
                  />
                  <span>Hours</span>
                </div>
                <div className="flex flex-row items-center text-sm gap-1">
                  <input
                    type="radio"
                    className="h-4 w-4"
                    name="stayTime"
                    checked={stayType == "days"}
                    value="days"
                    onChange={handleStayTypeChange}
                  />
                  <span>Days</span>
                </div>
              </div>
            </div>
            {stayType == "hours" ? null : ( // </div> // ? to be implemented when the hours logic has been worked upon fully //   </div> //     </div> //       <span>12 hrs</span> //       /> //         name="hoursOptions" //         className="h-4 w-4" //         type="radio" //       <input //     <div className="flex flex-row items-center text-sm gap-1"> //     </div> //       <span>6 hrs</span> //       /> //         name="hoursOptions" //         className="h-4 w-4" //         type="radio" //       <input //     <div className="flex flex-row items-center text-sm gap-1"> //     </div> //       <span>3 hrs</span> //       /> //         name="hoursOptions" //         className="h-4 w-4" //         type="radio" //       <input //     <div className="flex flex-row items-center text-sm gap-1"> //   <div className="flex flex-row items-center gap-3"> //   </span> //     Select hours //   <span className="text-sm font-semibold text-gray-500"> //   {/* hours booking slot section like 3hrs, 6hrs, 12hrs */} // <div className="flex flex-col gap-1 ml-5">
              <div className="ml-5 flex flex-col gap-1">
                {/* Check-In date and Check-Out Date */}
                <span className="text-gray-500 text-sm">Select dates</span>
                <div className="ml-3 flex flex-row items-center justify-between relative">
                  <div className="flex flex-col">
                    <span className="text-sm text-green-600">Check In</span>
                    <DatePicker
                      selected={checkInDate}
                      className="outline-none text-sm bg-green-200 w-[100px] text-center text-green-700 rounded-md"
                      dateFormat="MMM d, yyyy"
                      onChange={(date) => {
                        setCheckInDate(date);
                        setShowDays(true);
                      }}
                      onKeyDown={(e) => e.preventDefault()}
                      calendarClassName="absolute left-10"
                    />
                  </div>
                  {showDays && (
                    <span className="mt-4 text-sm border-[1.5px] border-green-300 px-2 rounded-full">
                      {/* {error.length > 0
                        ? error
                        : `${calculateDays(checkInDate, checkOutDate)} Days`} */}
                      {calculateDays(checkInDate, checkOutDate)} Days
                    </span>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm text-red-600">Check Out</span>
                    <DatePicker
                      selected={checkOutDate}
                      filterDate={filterPassedDate}
                      className="outline-none  text-sm bg-red-200 w-[100px] text-center text-red-700 rounded-md"
                      dateFormat="MMM d, yyyy"
                      onChange={(date) => {
                        setCheckOutDate(date);
                        setShowDays(true);
                      }}
                      onKeyDown={(e) => e.preventDefault()}
                      calendarClassName="absolute right-20"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Guests like number of adults, number of children */}
        <div>
          <span className="font-semibold text-gray-500">Amenities</span>
          <div className="md:flex flex-row gap-1 grid grid-cols-2 pt-2">
            <div className="ml-1 ">
              <div className="flex flex-row gap-2 items-center">
                <span className="text-sm text-gray-500">Rooms</span>
                <input
                  type="number"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className="border-[1px] border-neutral-400 px-1 py-[2px] text-sm w-16 rounded-md outline-none"
                />
                {/* <Dropdown
                  options={options}
                  onSelect={(option) => setRooms(option)}
                  defaultNum={rooms}
                /> */}
              </div>
            </div>
          </div>
        </div>
        <ScrollLink to="searchDiv" smooth={true} duration={700} offset={-150}>
          <button
            // disabled // ! temporary disable
            onClick={() => {
              handleSearch();
            }}
            className="absolute active:scale-105 transition transform duration-300 bottom-[-20px] bg-green-500 text-white px-20 font-bold py-2 rounded-full md:right-[105px] right-[60px]"
          >
            Search
          </button>
        </ScrollLink>
      </div>
      {/* Design Div */}
      <div className="w-[800px] h-[800px] rounded-full bg-green-500 mt-[-300px] ml-[-100px]"></div>

      <div
        onClick={() => {
          if (user) {
            setShowCreateModal(true);
          } else {
            router.push("/auth/signin");
          }
        }}
        className="absolute md:right-[150px] md:top-[70px] hidden md:block"
      >
        <video
          src="/assets/introVid.mp4"
          className="rounded-lg md:w-[320px]"
          loop
          autoPlay
        ></video>
      </div>
    </div>
  );
}

export default SuperHeader;
