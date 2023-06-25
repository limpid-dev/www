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
        <script src="https://epay.homebank.kz/payform/payment-api.js" />
      </Head>
      <Component {...pageProps} />
      <Toaster />
      <Script defer data-domain="limpid.kz" src="/js/script.js" />
    </div>
  );
}

export default appWithTranslation(App);
