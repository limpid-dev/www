import "focus-visible";
import "../tailwind.css";
import clsx from "clsx";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }) {
  return (
    <div
      className={clsx(inter.variable, "font-sans scroll-smooth antialiased")}
    >
      <Component {...pageProps} />
    </div>
  );
}
