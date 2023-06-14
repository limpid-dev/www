import "../tailwind.css";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-full">
      <Head>
        <title>LIM - все для людей</title>
      </Head>
      <Component {...pageProps} />
      <Script defer data-domain="limpid.kz" src="/js/script.js" />
    </div>
  );
}

export default appWithTranslation(App);
