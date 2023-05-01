import "focus-visible";
import "../tailwind.css";
import { AppProps } from "next/app";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Script defer data-domain="limpid.kz" src="/js/script.js" />
    </>
  );
}
