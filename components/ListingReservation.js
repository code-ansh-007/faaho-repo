import { useEffect, useState } from "react";
import { Button } from "./Button";
import Calendar from "./Calendar";
import { differenceInCalendarDays } from "date-fns";
import { Heading } from "./Heading";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ListingReservation = ({
  nightlyPrice,
  threeHoursPrice,
  sixHoursPrice,
  twelveHoursPrice,
  onSubmit,
  disabled,
  disabledDates,
  disabledMonths,
  monthlyPrice,
  proposedPrice,
}) => {
  const [bookingType, setBookingType] = useState("date"); // ? this state contains two types of state, the book by hours or book by number of days, as the client requested for two types of booking model by hours (3hrs, 6hrs, or 12 hrs) or by date where the user can select from a reange of dates
  const [numOfHours, setNumOfHours] = useState(3);
  const [totalPrice, setTotalPrice] = useState(
    bookingType == "date" ? nightlyPrice : threeHoursPrice
  );
  const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };
  const [dateRange, setDateRange] = useState(initialDateRange);

  // ? PGs and Apartments handling states
  const [monthPrice, setMonthPrice] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState([]);

  useEffect(() => {
    if (selectedMonths.length == 0) {
      setMonthPrice(0);
    }
  }, [selectedMonths]);

  const toggleMonthSelect = (month) => {
    if (!selectedMonths.includes(month)) {
      setSelectedMonths([...selectedMonths, month]);
      console.log(selectedMonths.length);
      setMonthPrice(monthlyPrice * (selectedMonths.length + 1));
    } else {
      const newArray = selectedMonths.filter((item) => item !== month);
      setSelectedMonths(newArray);
      setMonthPrice(monthlyPrice * (selectedMonths.length - 1));
    }
  };

  const handleBookingTypeChange = (e) => {
    setBookingType(e.target.value);
    if (e.target.value == "date") {
      setTotalPrice(nightlyPrice);
      setDateRange(initialDateRange);
    } else {
      setTotalPrice(threeHoursPrice);
      setNumOfHours(3);
    }
  };

  const handleNumOfHoursChange = (e) => {
    setNumOfHours(e.target.value);
    if (e.target.value == 3) {
      setTotalPrice(threeHoursPrice);
    }
    if (e.target.value == 6) {
      setTotalPrice(sixHoursPrice);
    }
    if (e.target.value == 12) {
      setTotalPrice(twelveHoursPrice);
    }
  };

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );
      if (dayCount && nightlyPrice) {
        setTotalPrice(
          dayCount * parseInt(nightlyPrice) + parseInt(nightlyPrice)
        );
      } else {
        setTotalPrice(parseInt(nightlyPrice));
      }
    }
  }, [dateRange]);

  const onDateChange = (value) => {
    setDateRange(value.selection);
  };

  const currDate = new Date();
  const currYear = currDate.getFullYear();

  if (proposedPrice) {
    return (
      <main className="bg-white rounded-xl border-[1px] border-neutral-200 flex flex-col h-fit p-2">
        <Heading
          title={"Proposed Price"}
          subtitle={"Price proposed by the owner not fixed."}
        />
        <span className="mb-3 mt-2">₹{proposedPrice}</span>
        <Heading
          title={"Contact Details"}
          subtitle={"Contact the dealer for further negotiations."}
        />
        <div className="mt-3 flex flex-row gap-10">
          <button className="flex flex-row items-center gap-1 outline-none underline">
            <span>
              <FaPhone className="rotate-90" />
            </span>
            <a href="tel:+91 99880 00664">Phone</a>
          </button>
          <button className="flex flex-row items-center gap-1 outline-none underline">
            <span>
              <MdEmail className="text-lg" />
            </span>
            <a href="mailto:roomsevamanage@gmail.com">Email</a>
          </button>
        </div>
      </main>
    );
  } else if (!monthlyPrice) {
    return (
      <div className="bg-white rounded-xl border-[1px] border-neutral-200 flex flex-col p-2 h-fit md:w-[350px]">
        <div className="flex items-center gap-1 p-1">
          <div className="text-2xl font-semibold">₹ {nightlyPrice}</div>
          <div className="font-light text-neutral-600">night</div>
        </div>
        <hr />
        <div className="flex flex-col gap-1 my-3 ml-2">
          <span className="text-lg font-semibold">Book In</span>
          <div className="flex flex-row items-center gap-5">
            <div className="flex flex-row items-center gap-2">
              <input
                type="radio"
                name="bookingType"
                value="hours"
                checked={bookingType === "hours"}
                onChange={handleBookingTypeChange}
                className="w-4 h-4"
              />
              <span>Hours</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <input
                type="radio"
                name="bookingType"
                value="date"
                checked={bookingType === "date"}
                onChange={handleBookingTypeChange}
                className="w-4 h-4"
              />
              <span>Date</span>
            </div>
          </div>
        </div>
        <hr />
        {bookingType == "date" ? (
          <Calendar
            value={dateRange}
            disabledDates={disabledDates}
            onChange={(value) => onDateChange(value)}
          />
        ) : (
          <div className="flex flex-col gap-1 my-3 ml-2">
            <span className="text-lg font-semibold">Choose duration</span>
            <div className="flex flex-row items-center gap-5">
              <div className="flex flex-col gap-1 items-center">
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="radio"
                    name="numOfHours"
                    value={3}
                    checked={numOfHours == 3}
                    onChange={handleNumOfHoursChange}
                    className="w-4 h-4"
                  />
                  <span>3 Hrs</span>
                </div>
                <span className="bg-green-400 text-white text-sm px-2 rounded-md">
                  ₹{threeHoursPrice}
                </span>
              </div>
              <div className=" flex flex-col items-center gap-1">
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="radio"
                    name="numOfHours"
                    value={6}
                    checked={numOfHours == 6}
                    onChange={handleNumOfHoursChange}
                    className="w-4 h-4"
                  />
                  <span>6 Hrs</span>
                </div>
                <span className="bg-green-400 text-white text-sm px-2 rounded-md">
                  ₹{sixHoursPrice}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="radio"
                    name="numOfHours"
                    value={12}
                    checked={numOfHours == 12}
                    onChange={handleNumOfHoursChange}
                    className="w-4 h-4"
                  />
                  <span>12 Hrs</span>
                </div>
                <span className="bg-green-400 text-white text-sm px-2 rounded-md">
                  ₹{twelveHoursPrice}
                </span>
              </div>
            </div>
          </div>
        )}
        <hr />
        <div className="p-4">
          <Button
            disabled={disabled}
            label={"Reserve"}
            onClick={() => {
              onSubmit(totalPrice);
            }}
          />
        </div>
        <div className="p-4 flex items-center justify-between font-semibold text-lg">
          <div>Total</div>
          <div>₹ {totalPrice}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="border-[1px] border-gray-300 p-3 rounded-xl w-[380px] h-fit">
        <Heading
          title={`Year ${currYear}`}
          subtitle={"How many months do you plan to stay ?"}
        />
        <hr className="mt-2 border-gray-300" />
        {/* Below is the div which contains the months */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <button
            disabled={disabledMonths.includes("january")}
            onClick={() => toggleMonthSelect("january")}
            className={`${
              selectedMonths.includes("january")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            January
          </button>
          <button
            disabled={disabledMonths.includes("february")}
            onClick={() => toggleMonthSelect("february")}
            className={`${
              selectedMonths.includes("february")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            February
          </button>
          <button
            disabled={disabledMonths.includes("march")}
            onClick={() => toggleMonthSelect("march")}
            className={`${
              selectedMonths.includes("march")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            March
          </button>
          <button
            disabled={disabledMonths.includes("april")}
            onClick={() => toggleMonthSelect("april")}
            className={`${
              selectedMonths.includes("april")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            April
          </button>
          <button
            disabled={disabledMonths.includes("may")}
            onClick={() => toggleMonthSelect("may")}
            className={`${
              selectedMonths.includes("may")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            May
          </button>
          <button
            disabled={disabledMonths.includes("june")}
            onClick={() => toggleMonthSelect("June")}
            className={`${
              selectedMonths.includes("June")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            June
          </button>
          <button
            disabled={disabledMonths.includes("july")}
            onClick={() => toggleMonthSelect("July")}
            className={`${
              selectedMonths.includes("July")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            July
          </button>
          <button
            disabled={disabledMonths.includes("august")}
            onClick={() => toggleMonthSelect("august")}
            className={`${
              selectedMonths.includes("august")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            August
          </button>
          <button
            disabled={disabledMonths.includes("september")}
            onClick={() => toggleMonthSelect("september")}
            className={`${
              selectedMonths.includes("september")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            September
          </button>
          <button
            disabled={disabledMonths.includes("october")}
            onClick={() => toggleMonthSelect("october")}
            className={`${
              selectedMonths.includes("october")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            October
          </button>
          <button
            disabled={disabledMonths.includes("november")}
            onClick={() => toggleMonthSelect("november")}
            className={`${
              selectedMonths.includes("november")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            November
          </button>
          <button
            disabled={disabledMonths.includes("december")}
            onClick={() => toggleMonthSelect("december")}
            className={`${
              selectedMonths.includes("december")
                ? "bg-green-200 text-green-700 border-[1px] border-green-500"
                : "text-gray-700 border-[1px] border-gray-400"
            } w-full text-sm flex items-center justify-center px-3 py-1 rounded-lg`}
          >
            December
          </button>
        </div>
        <hr className="mt-3 border-gray-300" />
        <div className="flex flex-col gap-4 mt-3">
          <Button
            disabled={disabled}
            label={"Reserve"}
            onClick={() => {
              if (monthPrice == 0) return;
              else onSubmit(monthPrice, selectedMonths);
            }}
          />
          <div className="flex flex-row items-center justify-between">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-semibold text-lg">₹ {monthPrice}</span>
          </div>
        </div>
      </div>
    );
  }
};

export default ListingReservation;
