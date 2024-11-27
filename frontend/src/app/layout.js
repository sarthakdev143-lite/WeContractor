import localFont from "next/font/local";
import "./globals.css";
import 'remixicon/fonts/remixicon.css'
import Navbar from "@/components/Navbar";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Buy / Sell Property.",
  description: "Creator : github@sarthakdev143",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="preload"
          href="/default-avatar.webp"
          as="image"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <Navbar />
        <main className='px-4 pb-8 mt-4'>{children}</main>
      </body>
    </html>
  );
}
