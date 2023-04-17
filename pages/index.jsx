import Head from "next/head";
import { CallToAction } from "../components/CallToAction";
import { Faqs } from "../components/Faqs";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Pricing } from "../components/Pricing";
import { PrimaryFeatures } from "../components/PrimaryFeatures";
import { SecondaryFeatures } from "../components/SecondaryFeatures";
import { Testimonials } from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Head>
        <title>Limpid - Найди единомышленников и начни свой бизнес</title>
        <meta
          name="description"
          content="Инструмент для предпринимателей по поиску и работе с партнёрами ."
        />
      </Head>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
