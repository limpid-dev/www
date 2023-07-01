import "../tailwind.css";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import { Toaster } from "../components/primitives/toaster";

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-full">
      <Head>
        <title>LIM - все для людей</title>
      </Head>
      <Component {...pageProps} />
      <Toaster />
      <Script src="https://epay.homebank.kz/payform/payment-api.js" />
      <Script defer data-domain="limpid.kz" src="/js/script.js" />
      <Script defer src="https://epay.homebank.kz/payform/payment-api.js" />
    </div>
  );
}

export default appWithTranslation(App);
