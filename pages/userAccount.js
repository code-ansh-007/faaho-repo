import React from "react";
import { getSession, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Head from "next/head";

const UserAccount = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <>
      <Head>
        <title>{session?.user?.name}'s Account - Faaho.com</title>
        <meta
          name="description"
          content={`Welcome to ${session?.user?.name}'s account on Faaho.com. Manage your profile, bookings, and preferences.`}
        />
        <meta
          name="keywords"
          content={`${session.user.name}, account, profile, bookings, preferences, Faaho, travel`}
        />
        {/* Add more meta tags as needed */}
      </Head>
      <main className="flex h-screen w-full flex-col items-center justify-center space-y-4">
        <span className="font-bold text-3xl text-green-600 mb-10">
          Hello Traveller
        </span>
        <div className="relative flex flex-col items-center">
          <Image
            src={
              session.user.image
                ? session.user.image
                : "/assets/placeholder.jpg"
            }
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>
        <span className="font-bold text-xl text-gray-700">
          {session.user.name}
        </span>
        <span>{session.user.email}</span>
        <button
          onClick={signOut}
          className="bg-green-300 border-2 border-green-600 text-green-600 font-semibold px-2  py-1 active:scale-105 transition transform duration-150 rounded-md"
        >
          Logout
        </button>
      </main>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: { destination: "/auth/signin" },
    };
  }
  return {
    props: { session },
  };
};

export default UserAccount;
