import Slider from "@/components/Slider";
import Image from "next/image";
import { useRouter } from "next/router";
import { categories } from "@/components/Banner";
import { MdLocationOn } from "react-icons/md";
import MapBoxComponent from "@/components/map/MapBoxComponent";
import { FaBed } from "react-icons/fa";
import { FaToilet } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { BsDoorOpenFill } from "react-icons/bs";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import ListingReservation from "@/components/ListingReservation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Heading } from "@/components/Heading";
import capitalizeEachWord from "@/utils/capitalizeEachWord";
import Head from "next/head";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const RoomDetails = ({ listing, listingId, reservations }) => {
  const { data: session } = useSession();

  const router = useRouter();
  const {
    name,
    category,
    price,
    desc,
    images,
    authorId,
    roomCount,
    adultCount,
    childCount,
    beds, // ? recent
    washrooms, // ? recent
    landmark,
    lat,
    lng,
    location,
    street,
    gmapsUrl,
    threeHoursPrice,
    sixHoursPrice,
    twelveHoursPrice,
    monthlyPrice,
    nightlyPrice,
    // ! below details are for plots and buildings
    length,
    breadth,
    rooms,
    floors,
  } = listing;
  const [screenWidth, setScreenWidth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorImage, setAuthorImage] = useState("");
  const [catIcon, setCatIcon] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [disabledDates, setDisabledDates] = useState([]);
  const [disabledMonths, setDisabledMonths] = useState([]);

  async function onCreateReservation(paymentId, totalPrice, months) {
    // ? here "months" is an array of months for which the particular PG or Apartment has been booked for which basically tells the onCreateReservation function that the reservaton has to be made for PGs and Apartments only
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (months) {
      setIsLoading(true);
      await addDoc(collection(db, "reservations"), {
        userId: session.user.id,
        category: "pgApt", // ? the cateogory pgApt is for knowwing the type of reservation
        listingId,
        totalPrice,
        months,
        paymentId,
        authorId,
        timestamp: serverTimestamp(),
      })
        .then(() => {
          setIsLoading(false);
          toast("Added reservation ✅");
          router.push(`/trips/${session.user.id}`);
        })
        .catch(() => {
          toast("Something went wrong");
        });
    } else {
      // ? the else block is for the reservations related to Hotel rooms and Rental Houses as there reservation logic is different
      setIsLoading(true);
      await addDoc(collection(db, "reservations"), {
        userId: session.user.id,
        category: "hotelRental", // ? this category is for hotels and rental house
        listingId,
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        paymentId,
        authorId,
        timestamp: serverTimestamp(),
      })
        .then(() => {
          setIsLoading(false);
          toast("Added reservation ✅");
          router.push(`/trips/${session.user.id}`);
        })
        .catch(() => {
          toast("Something went wrong!");
        });
    }
  }

  const calculateDisabledMonths = useCallback(() => {
    if (reservations.length == 0) return;
    let months = [];
    reservations?.map((reservation) => {
      if (reservation.category == "pgApt") {
        // ! this condition is newly added
        const reservedMonths = reservation.months;
        months = [...months, reservedMonths];
      }
    });
    setDisabledMonths(months);
  }, [reservations]);

  const calculateDisabledDates = useCallback(() => {
    if (reservations.length === 0) return;
    let dates = [];
    reservations?.map((reservation) => {
      if (reservation.category == "hotelRental") {
        // ! this condition is newly added
        const range = eachDayOfInterval({
          start: new Date(reservation.startDate),
          end: new Date(reservation.endDate),
        });
        dates = [...dates, ...range];
      }
    });
    setDisabledDates(dates);
  }, [reservations]);

  useEffect(() => {
    calculateDisabledDates();
    calculateDisabledMonths();
  }, []);

  useEffect(() => {
    const { iconImg: catIcon, description: catDesc } = categories.find(
      (item) => item.label === category
    );
    setCatIcon(catIcon);
    setCatDesc(catDesc);

    async function getAuthorDetails() {
      const q = query(collection(db, "users"), where("userId", "==", authorId));
      const authorSnap = await getDocs(q);
      const author = authorSnap.docs[0];
      setAuthorImage(author?.data().image ? author.data().image : "");
      setAuthorName(author?.data().name);
    }
    getAuthorDetails();
  }, []);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener to update screenWidth when the window is resized
    window.addEventListener("resize", updateScreenWidth);

    // Initial calculation of the screen width
    updateScreenWidth();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  // ! RAZORPAY CODE BELOW

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  function handlePaymentSuccess(res, totalPrice) {
    if (res.razorpay_payment_id) {
      toast("Payment Successful ✅");
      onCreateReservation(res.razorpay_payment_id, totalPrice);
    } else {
      toast("Payment Failed ❌");
    }
  }
  const makePayment = async (totalPrice, months) => {
    const res = await initializeRazorpay();
    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }
    // Make API call to the serverless API
    const data = await fetch("/api/razorpay", {
      method: "POST",
      body: totalPrice,
    }).then((t) => t.json());
    console.log(data);
    var options = {
      key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      name: "Room Seva",
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: "Please complete the payment to continue.",
      image: "https://manuarora.in/logo.png",
      handler: function (response) {
        // console.log(response);
        handlePaymentSuccess(response, totalPrice, months);
      },
      prefill: {
        name: session.user.name,
        email: session.user.email,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      <Head>
        <title>{`${capitalizeEachWord(
          name
        )} - Room Details | faaho.com`}</title>
        <meta name="description" content={desc} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Your Name or Company Name" />
        <meta
          name="keywords"
          content="room, details, faaho, property, amenities"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={`https://faaho.com/room/${listingId}`} />
      </Head>
      <main className="mx-3 mt-4 flex flex-col md:items-center space-y-4 mb-20">
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
        {/* SLIDER DIV */}
        <div className="md:flex items-start gap-10">
          <div className="sm:max-w-[550px] mx-2">
            <Slider listingId={listingId}>
              {images?.map((item) => {
                return (
                  <div
                    key={item}
                    className="relative w-80 h-80 sm:w-[550px] sm:h-[450px]"
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
          </div>
          <div className="flex flex-col space-y-4 mt-5">
            <span className="font-semibold text-3xl">
              {capitalizeEachWord(name)}
            </span>
            {/* middle details section */}
            <div className="flex flex-col gap-3">
              <span className="w-full">{desc}</span>
              {/* ADD THE HOSTED BY INFORMATION HERE */}
              <div className="flex items-center gap-3">
                <Image
                  src={
                    authorImage === "" ? "/assets/placeholder.jpg" : authorImage
                  }
                  alt="user pic"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <span>
                  {category == "Plots" || category == "Buildings"
                    ? "Listed"
                    : "Hosted"}{" "}
                  by {authorName}
                </span>
              </div>
              <hr />
              <div className="flex items-end gap-3">
                <Image
                  src={catIcon}
                  alt="category image"
                  width={30}
                  height={30}
                />
                <span>{catDesc}</span>
              </div>
              <hr />
              <span className="font-bold text-lg flex items-center gap-1">
                <span>Address</span>
                <MdLocationOn size={24} />
              </span>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <span className="font-bold">City:</span>
                    <span className="text-neutral-700">{location}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">Street/Locality:</span>
                    <span className="text-neutral-700">{street}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">Landmark:</span>
                    <span className="text-neutral-700">{landmark}</span>
                  </div>
                  {gmapsUrl && (
                    <Link href={gmapsUrl} target="_blank">
                      <div className="flex items-center gap-2">
                        <Image
                          src={"/assets/gmaps.png"}
                          width={30}
                          height={30}
                        />
                        <span className="text-blue-500 font-bold hover:underline">
                          On Google Maps
                        </span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="flex flex-col space-y-4 md:flex-row md:justify-evenly w-full">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-lg">Map View</span>
            <MapBoxComponent
              lat={lat}
              lng={lng}
              latSetterFunction={() => {}}
              lngSetterFunction={() => {}}
              listingView={true}
              large={screenWidth < 600 ? false : true}
            />
            <hr />
            {category == "Plots" || category == "Buildings" ? (
              <div>
                <Heading
                  title={"Property Details"}
                  subtitle={"Basic details of the property."}
                />
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Dimensions</span>
                  <div className="flex flex-row gap-4">
                    <span>Length: {length}ft</span>
                    <span>Breadth: {breadth}ft</span>
                  </div>
                </div>
                {category == "Buildings" && (
                  <div className="flex flex-col gap-1 mt-3">
                    <span className="font-bold">Misc Details</span>
                    <div className="flex flex-row gap-4">
                      <span>Rooms: {rooms}</span>
                      <span>Floors: {floors}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <span className="font-bold text-lg">
                  Amenities and Conveniences
                </span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-end gap-3">
                    <BsDoorOpenFill size={24} />
                    <span className="font-bold flex gap-1">
                      <span>Number of rooms:</span>
                      <span className="font-normal text-neutral-700">
                        {roomCount} rooms
                      </span>
                    </span>
                  </div>
                  <div className="flex items-end gap-3">
                    <FaBed size={24} />
                    <span className="font-bold flex gap-1">
                      <span>Number of beds:</span>
                      <span className="font-normal text-neutral-700">
                        {beds ? beds + " beds" : "not mentioned"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-end gap-3">
                    <FaToilet size={24} />
                    <span className="font-bold flex gap-1">
                      <span>Number of washrooms:</span>
                      <span className="font-normal text-neutral-700">
                        {washrooms ? washrooms + " washrooms" : "not mentioned"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RESERVATION DIV */}

          <ListingReservation
            nightlyPrice={nightlyPrice}
            threeHoursPrice={threeHoursPrice}
            sixHoursPrice={sixHoursPrice}
            twelveHoursPrice={twelveHoursPrice}
            monthlyPrice={monthlyPrice}
            onChangeDate={(value) => setDateRange(value)}
            dateRange={dateRange}
            onSubmit={(totalPrice) => makePayment(totalPrice)}
            disabled={isLoading}
            disabledDates={disabledDates}
            disabledMonths={disabledMonths}
            proposedPrice={
              category == "Plots" || category == "Buildings" ? price : null
            }
          />
        </div>
      </main>
    </>
  );
};

export default RoomDetails;

export async function getServerSideProps(context) {
  const { roomid: listingId } = context.params;
  // ? fetching the listing
  const listingSnap = await getDoc(doc(db, "listings", listingId));
  const listing = listingSnap.data();
  // console.log(listing);
  // ? converting the timstamp to a string
  listing.timestamp = listing.timestamp.toDate().toString();
  // ? fetching the reservations with the listing id
  const q = query(
    collection(db, "reservations"),
    where("listingId", "==", listingId)
  );
  const reservationsSnap = await getDocs(q);
  const reservations = reservationsSnap.docs.map((doc) => {
    const reservationData = doc.data();
    reservationData.startDate = reservationData.startDate
      .toDate()
      .toISOString();
    reservationData.endDate = reservationData.endDate.toDate().toISOString();
    reservationData.timestamp = reservationData.timestamp.toDate().toString();
    return reservationData;
  });
  return {
    props: {
      listing,
      listingId,
      reservations,
    },
  };
}
