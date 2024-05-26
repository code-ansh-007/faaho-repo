import { getProviders, getSession, signIn } from "next-auth/react";
import React, { useState } from "react";
import google from "../../public/assets/google.png";
import bedroom from "../../public/assets/bedroom.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, createUserInFirestore, db } from "@/firebase";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import Head from "next/head";

const Register = ({ providers }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), {
        email,
        name,
        password: await bcrypt.hash(password, 12),
        method: "credentials",
        userId: uuidv4(),
        favIds: [],
        role: "basic",
      });
      router.push("/auth/signin");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error while creating the user: ", error);
    }
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
      router.push("/auth/signin");
    } else {
      await createUserInFirestore(user);
    }
  };

  return (
    <>
      <Head>
        <title>Register - Faaho.com</title>
        <meta
          name="description"
          content="Register to access exclusive features on Faaho.com."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="registration, sign up, account creation, Faaho.com"
        />
      </Head>
      <main className="flex flex-col items-center justify-center h-screen w-screen mb-10">
        <Image src={bedroom} width={120} className="mb-4" />
        {Object.values(providers).map((provider) => {
          if (provider.name == "Credentials") {
            return (
              <form
                key={provider.name}
                onSubmit={handleSubmit}
                className="flex flex-col items-center space-y-3 w-full  md:w-[375px] px-10"
              >
                <span className="text-3xl font-bold text-gray-700">
                  Register
                </span>
                <div className="w-full">
                  <label htmlFor="name" className="font-semibold text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="border-b-[2px] border-green-500 outline-none w-full p-1"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="pass"
                    className="font-semibold flex flex-col text-gray-700"
                  >
                    <span>Password</span>
                    <span className="text-red-500 text-sm">
                      Set a strong password
                    </span>
                  </label>
                  <input
                    type="password"
                    name="pass"
                    id="pass"
                    className="border-b-[2px] border-green-500 outline-none w-full p-1"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="text-xl font-semibold bg-green-300 border-2 border-green-600 text-green-600 w-full rounded-lg py-2"
                >
                  Register
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
                onClick={() => signIn("google")}
                // onClick={handleGoogleSignIn}
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
          Already a user ?
          <span
            className="underline text-blue-600"
            onClick={() => router.push("/auth/signin")}
          >
            click here to sign in
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

export default Register;
