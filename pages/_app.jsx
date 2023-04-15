import "focus-visible";
import "../tailwind.css";

export default function App({ Component, pageProps }) {
  return (
    <div className="scroll-smooth antialiased">
      <Component {...pageProps} />
    </div>
  );
}
