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
import AUCTIONSMOBILE from "../images/screenshots/auctionsMobile.png";
import PROFILECREATE from "../images/screenshots/profileCreate.png";
import PROFILECREATEMOBILE from "../images/screenshots/profileCreateSmall.png";
import PROJECTSMOBILE from "../images/screenshots/projectMobile.png";
import TENDERSMOBILE from "../images/screenshots/tendersMobile.png";

function App({ Component, pageProps }: AppProps) {
  const [largeScreen, setLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newScreenWidth = window.innerWidth;
      setLargeScreen(newScreenWidth > 896);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [verification, setVerification] = useState(false);
  const largeScreenImages = [PROFILECREATE, PROJECTS, AUCTIONS, TENDERS];
  const smallScreenImages = [
    PROFILECREATEMOBILE,
    PROJECTSMOBILE,
    AUCTIONSMOBILE,
    TENDERSMOBILE,
  ];

  const descriptions = [
    "Создайте профиль - без него ничего не получится!",
    "Обозревайте проекты для совместной работы или создайте свой",
    "Участвуйте на продажах, нет никаких ограничений",
    "Участвуйте на закупках, конкурентная среда и полная прозрачность",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % largeScreenImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + largeScreenImages.length) % largeScreenImages.length
    );
  };

  const isLastImage = currentImageIndex === largeScreenImages.length - 1;

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
    <div className="bg-slate-50">
      <Head>
        <title>LIM - все для людей</title>
      </Head>
      <Component {...pageProps} />
      <Dialog open={verification} onOpenChange={setVerification}>
        <DialogTrigger />
        <DialogContent className="sm:max-w-[825px] p-10">
          <DialogHeader>
            <DialogTitle>Тур по продукту</DialogTitle>
            <DialogDescription className="text-slate-900 sm:text-[20px]">
              {descriptions[currentImageIndex]}
            </DialogDescription>
          </DialogHeader>
          <div className="image-container">
            <Image
              src={
                largeScreen
                  ? largeScreenImages[currentImageIndex]
                  : smallScreenImages[currentImageIndex]
              }
              alt="Image"
              className="rounded-md max-h-96 w-auto m-auto"
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
      <Toaster />
      <Script src="https://epay.homebank.kz/payform/payment-api.js" />
      <Script defer data-domain="limpid.kz" src="/js/script.js" />
      <Script defer src="https://epay.homebank.kz/payform/payment-api.js" />
    </div>
  );
}

export default appWithTranslation(App);
