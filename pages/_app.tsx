import "focus-visible";
import "../tailwind.css";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-full">
      <Head>
        <title>Платформа LIM!</title>
      </Head>
      <Component {...pageProps} />
      <Script defer data-domain="limpid.kz" src="/js/script.js" />
    </div>
  );
}
