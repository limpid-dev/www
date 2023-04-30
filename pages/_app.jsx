import "focus-visible";
import "../tailwind.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* {typeof window !== "undefined" &&
          window.location.hostname === "limpid.kz" && (
            <script async defer data-domain="limpid.kz" src="/js/script.js" />
          )} */}
        <script
          defer
          data-domain="limpid.kz"
          src="https://limpid.kz/js/script.js"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
