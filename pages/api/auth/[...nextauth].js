import { createUserInFirestore, db } from "@/firebase";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // ! have to modify it according to the need
      type: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password)
          throw new Error("Invalid Credentials!");
        const q = query(
          collection(db, "users"),
          where("email", "==", credentials.email)
        );
        const userSnap = await getDocs(q);
        if (userSnap.empty) {
          throw new Error("User not registered!");
        }
        const userDoc = userSnap.docs[0];
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          userDoc.data().password
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials!");
        }
        return {
          email: userDoc.data().email,
          name: userDoc.data().name,
          id: userDoc.data().userId,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      await createUserInFirestore(user);
      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/register",
  },
});
