import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Pricing } from "../components/pricing";
import { PrimaryFeatures } from "../components/primary-features";
import { SecondaryFeatures } from "../components/secondary-features";
import { Testimonials } from "../components/testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
