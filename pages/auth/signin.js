import { getProviders, getSession, signIn } from "next-auth/react";
import React, { useState } from "react";
import google from "../../public/assets/google.png";
import bedroom from "../../public/assets/bedroom.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import { auth, db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import Head from "next/head";

const Signin = ({ providers }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((callback) => {
      if (callback?.ok) {
        toast("Successfully Logged In");
        router.push("/");
      }
      if (callback?.error) {
        alert(callback.error);
      }
    });
  }

  async function checkUserPresence(email) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    return !snapshot.empty;
  }

  const handleGoogleSignIn = async () => {
    const result = signIn("google");
    const user = result.user;
    const email = user?.email;

    const isUserRegistered = await checkUserPresence(email);

    if (isUserRegistered) {
      router.push("/");
    } else {
      router.push("/auth/register");
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - Faaho.com</title>
        <meta
          name="description"
          content="Sign in to access exclusive features on Faaho.com."
        />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="login, sign in,Faaho.com" />
        <meta property="og:title" content="Sign In - Faaho.com" />
        <meta
          property="og:description"
          content="Sign in to access exclusive features on Faaho.com."
        />
        <meta property="og:type" content="website" />
      </Head>
      <main className="flex flex-col items-center justify-center h-screen w-screen mb-10">
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
        <Image src={bedroom} width={150} className="mb-5 mt-5" />
        {Object.values(providers).map((provider) => {
          if (provider.name == "Credentials") {
            return (
              <form
                key={provider.name}
                onSubmit={handleSubmit}
                className="flex flex-col items-center space-y-5 w-full md:w-[375px] px-10"
              >
                <span className="text-3xl font-bold text-gray-700">
                  Welcome back
                </span>
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="font-semibold text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="border-b-[2px] border-green-500 outline-none w-full p-1"
                    placeholder="johndoe@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="pass" className="font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="pass"
                    id="pass"
                    className="border-b-[2px] border-green-500 outline-none w-full p-1"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="text-xl font-semibold bg-green-300 border-2 border-green-600 text-green-600 w-full rounded-lg py-2"
                >
                  Login
                </button>
                <div className="flex items-center space-x-2">
                  <hr className="border-b-[1px] border-gray-500 w-28" />
                  <span className="mb-1 font-semibold text-gray-700">OR</span>
                  <hr className="border-b-[1px] border-gray-500 w-28" />
                </div>
              </form>
            );
          } else {
            return (
              <div
                key={provider.name}
                // onClick={handleGoogleSignIn}
                onClick={() => signIn("google")}
                className="flex items-center space-x-2 border-2 border-gray-500 mt-5 active:scale-110 transition transform duration-500 ease-in-out p-[6px] rounded-lg px-10"
              >
                <Image src={google} width={40} />
                <button className="font-semibold">Continue with google</button>
              </div>
            );
          }
        })}
        {/* REGISTER PAGE DIV */}
        <div className="text-md mt-5">
          New User ?{" "}
          <span
            className="underline text-blue-600"
            onClick={() => router.push("/auth/register")}
          >
            click here to register
          </span>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { providers },
  };
}

export default Signin;
