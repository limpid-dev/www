import "../tailwind.css";
import { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import api from "../api";
import { Button } from "../components/primitives/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/primitives/dialog";
import { Toaster } from "../components/primitives/toaster";
import AUCTIONS from "../images/screenshots/allAuctions.webp";
import PROJECTS from "../images/screenshots/allProjects.webp";
import TENDERS from "../images/screenshots/allTenders.webp";
import PROFILECREATE from "../images/screenshots/profileCreate.png";

function App({ Component, pageProps }: AppProps) {
  const [verification, setVerification] = useState(false);
  const images = [PROFILECREATE, PROJECTS, AUCTIONS, TENDERS];
  const descriptions = [
    "Создайте профиль - без него ничего не получится!",
    "Обозревайте проекты для совместной работы или создайте свой",
    "Участвуйте на аукционах",
    "Участвуйте на продажах",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const isLastImage = currentImageIndex === images.length - 1;

  useEffect(() => {
    async function fetchUser() {
      const { data } = await api.getUser();
      if (data.data.is_product_tour_completed === false) {
        setVerification(true);
      }
    }
    fetchUser();
  }, []);

  const onSubmit = async () => {
    await api.updateUser({ is_product_tour_completed: true });
  };

  return (
    <div className="min-h-full">
      <Head>
        <title>LIM - все для людей</title>
      </Head>
      <Dialog open={verification} onOpenChange={setVerification}>
        <DialogTrigger />
        <DialogContent className="sm:max-w-[825px] p-10">
          <DialogHeader>
            <DialogTitle>Тур по продукту</DialogTitle>
            <DialogDescription className="text-slate-900 text-[22px]">
              {descriptions[currentImageIndex]}
            </DialogDescription>
          </DialogHeader>
          <div className="image-container">
            <Image
              src={images[currentImageIndex]}
              alt="Image"
              className="rounded-md"
            />
          </div>
          <div className="flex justify-end gap-5">
            {currentImageIndex > 0 && (
              <Button variant="subtle" onClick={prevImage}>
                Назад
              </Button>
            )}
            {isLastImage ? (
              <DialogClose>
                <Button onClick={() => onSubmit()}>Начать!</Button>
              </DialogClose>
            ) : (
              <Button onClick={nextImage}>Далее</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Component {...pageProps} />
      <Toaster />
      <Script src="https://epay.homebank.kz/payform/payment-api.js" />
      <Script defer data-domain="limpid.kz" src="/js/script.js" />
      <Script defer src="https://epay.homebank.kz/payform/payment-api.js" />
    </div>
  );
}

export default appWithTranslation(App);
