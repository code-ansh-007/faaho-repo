import { Heading } from "@/components/Heading";
import LargeCard from "@/components/LargeCard";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const PropertiesPage = ({ properties }) => {
  return (
    <>
      <Head>
        <title>Your Listed Properties - faaho.com</title>
        <meta
          name="description"
          content="Manage your listed properties on faaho.com."
        />
      </Head>
      <main className="m-5">
        <Heading
          title={"Your Listed Properties"}
          subtitle={"Manage your listed properties from here"}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 mt-5 place-items-center">
          {properties.reverse().map((listing) => {
            return (
              <LargeCard
                key={listing.listingId}
                listingId={listing.listingId}
                images={listing.images}
                name={listing.name}
                category={listing.category}
                price={listing.price}
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
              />
            );
          })}
        </div>
      </main>
    </>
  );
};

export default PropertiesPage;

export async function getServerSideProps(context) {
  const { authorId } = context.params;
  const qProperties = query(
    collection(db, "listings"),
    where("authorId", "==", authorId)
  );
  const propertiesSnap = await getDocs(qProperties);
  const properties = propertiesSnap.docs.map((doc) => {
    const listingId = doc.id;
    const propertyData = doc.data();
    propertyData.timestamp = propertyData.timestamp.toDate().toString();
    propertyData.listingId = listingId;
    return propertyData;
  });
  return {
    props: {
      properties,
    },
  };
}
