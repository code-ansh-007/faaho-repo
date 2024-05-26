import React, { useRef, useState } from "react";
import Modal from "./Modal";
import { useRecoilState } from "recoil";
import { useCreateModal } from "@/recoil/useCreateModal";
import { Heading } from "../Heading";
import { categories } from "../Banner";
import Image from "next/image";
import { Button } from "../Button";
import { AiOutlineCamera, AiOutlineLoading } from "react-icons/ai";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import InfoRegister from "../InfoRegister";
import { Input } from "../Input";
import MapBoxComponent from "@/components/map/MapBoxComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useSession } from "next-auth/react";
import { MdLocationOn } from "react-icons/md";

const CreateModal = () => {
  const [loadingUpload, setLoadingUpload] = useState(false);
  const { data: session } = useSession();
  // console.log(session);
  async function handleFormSubmit() {
    setLoadingUpload(true);

    if (category == "Hotels" || category == "Rental House") {
      await addDoc(collection(db, "listings"), {
        authorId: session?.user?.id,
        category,
        images: links,
        roomCount,
        // adultCount,
        // childCount,
        washrooms, // ? added in the latest update
        beds, // ? added in the latest update
        name: title,
        desc: description,
        lng,
        lat,
        street,
        landmark,
        gmapsUrl,
        location: locationName,
        threeHoursPrice: parseInt(threeHoursPrice),
        sixHoursPrice: parseInt(sixHoursPrice),
        twelveHoursPrice: parseInt(twelveHoursPrice),
        nightlyPrice: parseInt(nightlyPrice),
        timestamp: serverTimestamp(),
      })
        .then(() => {
          toast("Listing created successfully!");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoadingUpload(false);
          setCategory("");
          setLinks([]);
          setRoomCount(1);
          setAdultCount(1);
          setChildCount(1);
          setTitle("");
          setDescription("");
          setLat(30.8);
          setLng(75.15);
          setStreet("");
          setLandmark("");
          setThreeHoursPrice(1);
          setSixHoursPrice(1);
          setTwelveHoursPrice(1);
          setNightlyPrice(1);
          setLocationName("");
          setStep(STEPS.CATEGORY);
        });
    }

    if (category == "PGs" || category == "Apartments") {
      await addDoc(collection(db, "listings"), {
        authorId: session?.user?.id,
        category,
        images: links,
        roomCount,
        // adultCount,
        // childCount,
        washrooms, // ? added in the latest update
        beds, // ? added in the latest update
        name: title,
        desc: description,
        lng,
        lat,
        street,
        landmark,
        gmapsUrl,
        location: locationName,
        monthlyPrice: parseInt(monthlyPrice),
        timestamp: serverTimestamp(),
      })
        .then(() => {
          toast("Listing created successfully!");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoadingUpload(false);
          setCategory("");
          setLinks([]);
          setRoomCount(1);
          setAdultCount(1);
          setChildCount(1);
          setTitle("");
          setDescription("");
          setLat(30.8);
          setLng(75.15);
          setStreet("");
          setLandmark("");
          setMonthlyPrice(1);
          setLocationName("");
          setStep(STEPS.CATEGORY);
        });
    }

    if (category == "Plots" || category == "Buildings") {
      await addDoc(collection(db, "listings"), {
        authorId: session?.user?.id,
        category,
        images: links,
        phone,
        email,
        name: title,
        desc: description,
        lng,
        lat,
        street,
        landmark,
        gmapsUrl,
        location: locationName,
        price: category == "Plots" ? plotPrice : buildingPrice,
        length,
        breadth,
        rooms: category == "Plots" ? 0 : rooms,
        floors: category == "Plots" ? 0 : floors,
        timestamp: serverTimestamp(),
      })
        .then(() => {
          toast("Listing created successfully!");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoadingUpload(false);
          setCategory("");
          setLinks([]);
          setRoomCount(1);
          setAdultCount(1);
          setChildCount(1);
          setTitle("");
          setDescription("");
          setLat(30.8);
          setLng(75.15);
          setStreet("");
          setLandmark("");
          setMonthlyPrice(1);
          setLocationName("");
          setStep(STEPS.CATEGORY);
        });
    }
  }

  const STEPS = {
    CATEGORY: 1,
    IMAGES: 2,
    INFO: 3,
    DESCRIPTION: 4,
    LOCATION: 5,
    PRICE: 6,
  };
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [category, setCategory] = useState("");
  const filePickerRef = useRef(null);

  // ? IMAGE UPLOAD STATES
  const [images, setImages] = useState([]);
  const [links, setLinks] = useState([]);

  function onNext() {
    if (step === STEPS.PRICE) return;
    setStep(step + 1);
  }

  function onBack() {
    if (step === STEPS.CATEGORY) return;
    setStep(step - 1);
  }

  let bodyContent = null;

  if (step === STEPS.CATEGORY) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div className="absolute">
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />{" "}
        </div>
        <Heading
          title={"Which of these best describes your place?"}
          subtitle={"Choose a category"}
        />
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            return (
              <div
                key={cat.label}
                onClick={() => {
                  setCategory(cat.label);
                }}
                className={`flex flex-col gap-2 items-center border-[2px] p-3 rounded-xl hover:border-black ${
                  category === cat.label
                    ? "border-neutral-700"
                    : "border-neutral-300"
                }`}
              >
                <Image
                  alt="category image"
                  src={cat.iconImg}
                  width={50}
                  height={50}
                />
                <span className="text-sm">{cat.label}</span>
              </div>
            );
          })}
        </div>
        <hr />
        <div className="flex items-center gap-4">
          <Button label={"Back"} outline onClick={onBack} />
          <Button
            label={"Next"}
            onClick={() => {
              if (category === "") {
                toast("Please select a category");
                return;
              }
              onNext();
            }}
          />
        </div>
      </div>
    );
  }

  // ! IMAGE UPLOAD VIA CLOUDINARY API AND LOGIC

  const [loading, setLoading] = useState(false);

  async function handleImageSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setImages([]);
    try {
      for (let i = 0; i < images.length; i++) {
        const { url } = await uploadToCloudinary(images[i]);
        setLinks((prev) => [...prev, url]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex relative flex-col gap-8 items-center">
        <div className="absolute">
          <ToastContainer
            position="top-center"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />{" "}
        </div>
        <Heading
          title={"How does your place look like?"}
          subtitle={
            "Upload some images of your place, minimum 3 and maximum 15"
          }
        />
        {links.length === 15 && (
          <span className="text-sm text-red-500">
            *Image upload limit reached(maximum 15)
          </span>
        )}
        {/* IMAGES ADDING LOGIC */}

        {/* image upload gimmick */}
        <div className="bg-green-200 rounded-full p-2 w-fit">
          <AiOutlineCamera
            size={40}
            className="text-green-600"
            onClick={() => filePickerRef.current.click()}
          />
        </div>
        {/* image upload form */}
        <div className="w-full">
          <form>
            <input
              ref={filePickerRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setImages(e.target.files)}
              disabled={links.length === 15}
            />
            {loading ? (
              <div className="flex items-center gap-3 justify-center">
                <AiOutlineLoading
                  size={24}
                  className="text-green-600 animate-spin"
                />
                <span>Uploading...</span>
              </div>
            ) : (
              <Button
                label={"Upload"}
                outline
                small
                imagesSelected={images.length >= 3}
                onClick={(e) => {
                  if (links.length === 15) {
                    toast("You can upload only upto 15 images");
                    return;
                  }
                  handleImageSubmit(e);
                }}
                disabled={images.length === 0 || links.length === 15}
              />
            )}
          </form>
        </div>
        {/* uplaoded images preview after upload */}
        <div className="flex gap-3 overflow-x-scroll items-center">
          {links.length > 0 &&
            links.reverse().map((link) => {
              return (
                <Image
                  key={link}
                  src={link}
                  width={200}
                  height={200}
                  alt="property images"
                />
              );
            })}
        </div>

        <div className="flex items-center gap-4 w-full">
          <Button label={"Back"} outline onClick={onBack} />
          <Button
            label={"Next"}
            onClick={() => {
              if (links.length < 3) {
                toast("Upload atleast 3 images");
                return;
              }
              onNext();
            }}
          />
        </div>
      </div>
    );
  }

  // ? INFO STATES
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(1);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState("");
  const [length, setLength] = useState(null); // ? holds the length dimension of building or plot
  const [breadth, setBreadth] = useState(null); // ? holds the breadth dimension of buildinf or plot
  const [rooms, setRooms] = useState(null); // ? holds the number of rooms in a particular building
  const [floors, setFloors] = useState(null); // ? holds the number of floors in a particular building
  const [washrooms, setWashrooms] = useState(1);
  const [beds, setBeds] = useState(1);

  if (step === STEPS.INFO) {
    if (category == "Plots" || category == "Buildings") {
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
            title={"Where should dealer contact you ?"}
            subtitle={"Enter your contact details"}
          />
          {/* DETAILS SECTION */}
          <div className="flex flex-col gap-4">
            <Input
              id={"phoneNumber"}
              label={"Phone Number"}
              value={phone}
              setterFunction={setPhone}
              type={"tel"}
              required
            />
            <Input
              id={"email"}
              label={"Your Email"}
              value={email}
              setterFunction={setEmail}
              type={"email"}
              required
            />
          </div>
          {category == "Plots" ? (
            <div className="flex flex-col gap-4">
              <Heading
                title={"Property Dimensions"}
                subtitle={"Provide length and breadth of property(in feets)"}
              />
              <Input
                id={"length"}
                label={"Length(in feets)"}
                value={length}
                setterFunction={setLength}
                type="number"
                required
              />
              <Input
                id={"breadth"}
                label={"Breadth(in feets)"}
                value={breadth}
                setterFunction={setBreadth}
                type="number"
                required
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Heading
                title={"Property Dimensions"}
                subtitle={"Provide length and breadth of property(in feets)"}
              />
              <Input
                id={"length"}
                label={"Length(in feets)"}
                value={length}
                setterFunction={setLength}
                type="number"
                required
              />
              <Input
                id={"breadth"}
                label={"Breadth(in feets)"}
                value={breadth}
                setterFunction={setBreadth}
                type="number"
                required
              />
              <Heading
                title={"Building Details"}
                subtitle={"Provide some basic details about the building."}
              />
              <Input
                id={"rooms"}
                label={"Number of Rooms"}
                value={rooms}
                setterFunction={setRooms}
                type="number"
                required
              />
              <Input
                id={"floors"}
                label={"Number of Floors"}
                value={floors}
                setterFunction={setFloors}
                type="number"
                required
              />
            </div>
          )}
          <div className="flex items-center gap-4 w-full">
            <Button label={"Back"} outline onClick={onBack} />
            <Button label={"Next"} onClick={onNext} />
          </div>
        </div>
      );
    } else {
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
            title={"What amenities do you have?"}
            subtitle={"Enter some details regarding your place"}
          />
          <hr />
          {/* DETAILS SECTION */}
          <div className="flex flex-col gap-10">
            <InfoRegister
              title={"Number of rooms"}
              subtitle={"How many rooms do you have?"}
              value={roomCount}
              setterFunction={setRoomCount}
            />
            {/* <InfoRegister
              title={"Number of adults"}
              value={adultCount}
              setterFunction={setAdultCount}
            />
            <InfoRegister
              title={"Number of children"}
              value={childCount}
              setterFunction={setChildCount}
            /> */}
            <InfoRegister
              title={"Number of washrooms"}
              value={washrooms}
              setterFunction={setWashrooms}
            />
            <InfoRegister
              title={"Number of beds"}
              value={beds}
              setterFunction={setBeds}
            />
          </div>

          <div className="flex items-center gap-4 w-full">
            <Button label={"Back"} outline onClick={onBack} />
            <Button label={"Next"} onClick={onNext} />
          </div>
        </div>
      );
    }
  }

  // ? DESCRIPTION STATES

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div className="absolute">
          <ToastContainer
            position="top-center"
            autoClose={3000}
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
        <Heading
          title={"Describe your place"}
          subtitle={"A crisp and precise description works best!"}
        />
        {/* DESCRIPTION DIV */}
        <div className="flex flex-col gap-8">
          <Input
            id={"title"}
            label={"Name your place"}
            value={title}
            setterFunction={setTitle}
            required
          />
          <Input
            id={"description"}
            label={"Describe your place"}
            value={description}
            setterFunction={setDescription}
            required
            description
          />
        </div>

        <div className="flex items-center gap-4 w-full">
          <Button label={"Back"} outline onClick={onBack} />
          <Button
            label={"Next"}
            onClick={() => {
              if (title === "" || description === "") {
                toast("Title and description are mandatory");
                return;
              }
              onNext();
            }}
          />
        </div>
      </div>
    );
  }

  // ? LOCATION STATES
  const [lng, setLng] = useState(75.15);
  const [lat, setLat] = useState(30.8);
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [locationName, setLocationName] = useState("");
  const [gmapsUrl, setGmapsUrl] = useState(""); // ? this state handles the google maps location url of the property, so that the user can easily navigate to the location using gmaps

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div className="absolute">
          <ToastContainer
            position="top-center"
            autoClose={3000}
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
        <Heading
          title={"Where is your place located?"}
          subtitle={"Enter location from the mapbox or by searching"}
        />
        {/* MAPBOX LOGIC AND CODE */}
        <MapBoxComponent
          lat={lat}
          lng={lng}
          latSetterFunction={setLat}
          lngSetterFunction={setLng}
          setLocationName={setLocationName}
        />
        <div className="flex flex-col gap-3">
          <span className="text-lg font-bold">
            The location you selected on map -
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold">Tip:</span>
            <span className="text-sm text-neutral-600">
              Search on the search box
            </span>
          </span>
          <div className="flex items-center gap-1 bg-green-300 p-2 rounded-xl">
            <MdLocationOn size={30} />
            <span className="text-sm ">
              {locationName ? locationName : "None"}
            </span>
          </div>
        </div>
        <hr />
        {/* Additional Details of the location of the place */}
        <Input
          id={"street"}
          label={"Street name"}
          required
          value={street}
          setterFunction={setStreet}
          description={"e.g. Spooner St., Quohog"}
        />
        <Input
          id={"landmark"}
          label={"Landmark/Reference"}
          required
          value={landmark}
          setterFunction={setLandmark}
          description={"e.g. Near DB Fitness gym"}
        />
        <Input
          id={"gmapUrl"}
          label={"Google maps location URL"}
          type="url"
          required
          value={gmapsUrl}
          setterFunction={setGmapsUrl}
          description={"Paste your google maps location URL of the property"}
        />
        <div className="flex items-center gap-4 w-full">
          <Button label={"Back"} outline onClick={onBack} />
          <Button
            label={"Next"}
            onClick={() => {
              if (
                landmark === "" ||
                street === "" ||
                locationName === "" ||
                !gmapsUrl.includes("https://")
              ) {
                if (!gmapsUrl.includes("https://")) {
                  toast("Fill correct URL");
                  return;
                } else toast("Fill all the details!");
                return;
              }
              onNext();
            }}
          />
        </div>
      </div>
    );
  }

  // ! PRICING SECTION
  // ? Below states are for the hotels and Rental Houses
  const [threeHoursPrice, setThreeHoursPrice] = useState(1);
  const [sixHoursPrice, setSixHoursPrice] = useState(1);
  const [twelveHoursPrice, setTwelveHoursPrice] = useState(1);
  const [nightlyPrice, setNightlyPrice] = useState(1);

  // ?  Below logic is for PGs and Apartments
  const [monthlyPrice, setMonthlyPrice] = useState(1);

  // ? Below states is for plots and building pricing
  const [plotPrice, setPlotPrice] = useState(1);
  const [buildingPrice, setBuildingPrice] = useState(1);

  if (step == STEPS.PRICE) {
    if (category == "Hotels" || category == "Rental House") {
      bodyContent = (
        <div>
          <div>
            <Heading
              title={"Hourly Price"}
              subtitle={"How would you price your listing hourly ?(in Rupees)"}
            />

            <div className="flex flex-col gap-3 my-4">
              <div className="flex flex-col gap-3">
                <span className="">3 hrs</span>
                <Input
                  label={"Price"}
                  formatPrice
                  id={"threeHoursPrice"}
                  value={threeHoursPrice}
                  setterFunction={setThreeHoursPrice}
                  type="number"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <span className="">6 hrs</span>
                <Input
                  label={"Price"}
                  formatPrice
                  id={"sixHoursPrice"}
                  value={sixHoursPrice}
                  setterFunction={setSixHoursPrice}
                  type="number"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <span className="">12 hrs</span>
                <Input
                  label={"Price"}
                  formatPrice
                  id={"twelveHoursPrice"}
                  value={twelveHoursPrice}
                  setterFunction={setTwelveHoursPrice}
                  type="number"
                  required
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="my-3 flex flex-col gap-3 mb-10">
            <Heading
              title={"Nightly Price"}
              subtitle={"How would you price your listing nightly ?(in Rupees)"}
            />
            <Input
              label={"Price"}
              formatPrice
              id={"nightlyPrice"}
              value={nightlyPrice}
              setterFunction={setNightlyPrice}
              type="number"
              required
            />
          </div>

          {loadingUpload ? (
            <div className="flex items-center gap-3 justify-center">
              <AiOutlineLoading
                size={24}
                className="text-green-600 animate-spin"
              />
              <span>Creating listing...</span>
            </div>
          ) : (
            <Button
              label={"Create"}
              disabled={loadingUpload}
              onClick={() => {
                if (
                  threeHoursPrice === 1 ||
                  threeHoursPrice === 0 ||
                  threeHoursPrice < 0 ||
                  sixHoursPrice === 1 ||
                  sixHoursPrice === 0 ||
                  sixHoursPrice < 0 ||
                  twelveHoursPrice === 1 ||
                  twelveHoursPrice === 0 ||
                  twelveHoursPrice < 0 ||
                  nightlyPrice === 1 ||
                  nightlyPrice === 0 ||
                  nightlyPrice < 0
                ) {
                  toast("Invalid pricing");
                  return;
                }
                handleFormSubmit();
              }}
            />
          )}
        </div>
      );
    }

    if (category == "PGs" || category == "Apartments") {
      bodyContent = (
        <div className="flex flex-col gap-2">
          <Heading
            title={"Monthly Price"}
            subtitle={"Enter the monthly price of listing"}
          />
          <Input
            label={"Price"}
            formatPrice
            id={"monthlyPrice"}
            value={monthlyPrice}
            setterFunction={setMonthlyPrice}
            type="number"
          />
          {loadingUpload ? (
            <div className="flex items-center gap-3 justify-center">
              <AiOutlineLoading
                size={24}
                className="text-green-600 animate-spin"
              />
              <span>Creating listing...</span>
            </div>
          ) : (
            <Button
              label={"Create"}
              disabled={loadingUpload}
              onClick={() => {
                if (
                  monthlyPrice === 1 ||
                  monthlyPrice === 0 ||
                  monthlyPrice < 0
                ) {
                  toast("Invalid pricing");
                  return;
                }
                handleFormSubmit();
              }}
            />
          )}
        </div>
      );
    }

    if (category == "Plots" || category == "Buildings") {
      bodyContent = (
        <div className="flex flex-col gap-2">
          <Heading
            title={`${
              category == "Plots" ? "Price of Plot" : "Price of Building"
            }`}
            subtitle={"Enter the proposed price of the plot"}
          />
          <Input
            label={"Price"}
            formatPrice
            id={`${category == "Plots" ? "plotPrice" : "buildingPrice"}`}
            value={category == "Plots" ? plotPrice : buildingPrice}
            setterFunction={
              category == "Plots" ? setPlotPrice : setBuildingPrice
            }
            type="number"
          />
          {loadingUpload ? (
            <div className="flex items-center gap-3 justify-center">
              <AiOutlineLoading
                size={24}
                className="text-green-600 animate-spin"
              />
              <span>Creating listing...</span>
            </div>
          ) : (
            <Button
              label={"Create"}
              disabled={loadingUpload}
              onClick={() => {
                if (category == "Plots") {
                  if (plotPrice === 1 || plotPrice === 0 || plotPrice < 0) {
                    toast("Invalid pricing");
                    return;
                  }
                } else {
                  if (
                    buildingPrice === 1 ||
                    buildingPrice == 0 ||
                    buildingPrice < 0
                  ) {
                    toast("Invalid pricing");
                    return;
                  }
                }
                handleFormSubmit();
              }}
            />
          )}
        </div>
      );
    }
  }

  const [showCreateModal, setShowCreateModal] = useRecoilState(useCreateModal);
  return (
    <div className="relative">
      <div className="absolute">
        <ToastContainer
          position="top-center"
          autoClose={3000}
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
      <Modal
        title={"List Property"}
        body={bodyContent}
        close={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default CreateModal;
