import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Nunito } from "next/font/google";
import { RecoilRoot } from "recoil";

const font = Nunito({
  subsets: ["latin"],
});

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <div className={font.className}>
          <Component {...pageProps} />
          <Footer />
          <BottomNav />
        </div>
      </RecoilRoot>
    </SessionProvider>
  );
}
