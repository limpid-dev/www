import "focus-visible";
import "../tailwind.css";
import clsx from "clsx";
import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={clsx(inter.variable, "min-h-full font-sans")}>
      <Component {...pageProps} />
      <Script defer data-domain="limpid.kz" src="/js/script.js" />
    </div>
  );
}
