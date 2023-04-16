import "focus-visible";
import "../tailwind.css";
import { useEffect } from "react";
import api from "../api";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    api.health().then(console.info);
  }, []);

  return <Component {...pageProps} />;
}
