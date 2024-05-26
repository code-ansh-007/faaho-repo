import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";

const HeartButton = ({ listingId }) => {
  const { data: session } = useSession();
  const [hasFavorited, setHasFavorited] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function setInitially() {
      if (!session) {
        return;
      }
      const q = query(
        collection(db, "users"),
        where("userId", "==", session?.user?.id)
      );
      const userSnap = await getDocs(q);
      const user = userSnap.docs[0];
      if (user.data().favIds.includes(listingId)) setHasFavorited(true);
      else setHasFavorited(false);
    }
    setInitially();
  }, []);

  async function toggleFavorite(e) {
    e.stopPropagation();
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (hasFavorited) {
      const q = query(
        collection(db, "users"),
        where("userId", "==", session?.user?.id)
      );
      const userSnap = await getDocs(q);
      const userRef = userSnap.docs[0].ref;

      // ? UPDATING THE DOCUMENT IN THE FIRESTORE AFTER REMOVING THE LISITNG ID
      await updateDoc(userRef, {
        favIds: arrayRemove(listingId),
      })
        .then(() => {
          setHasFavorited(false);
          toast("Removed from favorites ✅");
        })
        .catch(() => {
          toast("Something went wrong!");
        });
    } else {
      const q = query(
        collection(db, "users"),
        where("userId", "==", session?.user?.id)
      );
      const userSnap = await getDocs(q);
      const userRef = userSnap.docs[0].ref;

      await updateDoc(userRef, {
        favIds: arrayUnion(listingId),
      })
        .then(() => {
          setHasFavorited(true);
          toast("Added to Favorites ✅");
        })
        .catch(() => {
          toast("Something went wrong!");
        });
    }
  }

  return (
    <div
      className="relative hover:opacity-80 transition cursor-pointer"
      onClick={toggleFavorite}
    >
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
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={`${hasFavorited ? "text-green-500" : "fill-neutral-500/70"}`}
      />
    </div>
  );
};

export default HeartButton;
