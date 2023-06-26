import { Popover, Tab, Transition } from "@headlessui/react";
import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Fragment, useEffect, useId, useState } from "react";
import api from "../api";
import { Button } from "../components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../components/primitives/dialog";
import { RadioGroup } from "../components/primitives/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/primitives/select";
import { ToastAction } from "../components/primitives/toast";
import { toast } from "../hooks/useToast";
import AstanaHub from "../images/astanaHub.png";
import avatarImage1 from "../images/avatars/avatar-1.webp";
import avatarImage2 from "../images/avatars/avatar-2.webp";
import avatarImage3 from "../images/avatars/avatar-3.webp";
import backgroundImage from "../images/background-features.webp";
import screenshotVatReturns from "../images/screenshots/allAuctions.webp";
import screenshotPayroll from "../images/screenshots/allProfiles.webp";
import screenshotExpenses from "../images/screenshots/allProjects.webp";
import screenshotReporting from "../images/screenshots/allTenders.webp";
import screenshotInventory from "../images/screenshots/chat.webp";
import screenshotContacts from "../images/screenshots/invoice.webp";
import screenshotProfitLoss from "../images/screenshots/myProjects.webp";

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function QuoteIcon(props) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  );
}

export function Container({ className, ...props }) {
  return (
    <div
      className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function PrimaryFeatures() {
  const [tabOrientation, setTabOrientation] = useState("horizontal");

  const { t } = useTranslation("common");

  useEffect(() => {
    const lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  const features = [
    {
      title: t("feat_t_1"),
      description: t("feat_d_1"),
      image: screenshotPayroll,
    },
    {
      title: t("feat_t_2"),
      description: t("feat_d_2"),
      image: screenshotExpenses,
    },
    {
      title: t("feat_t_3"),
      description: t("feat_d_3"),
      image: screenshotVatReturns,
    },
    {
      title: t("feat_t_4"),
      description: t("feat_d_4"),
      image: screenshotReporting,
    },
  ];

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden pb-28 pt-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%] "
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className=" text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            {t("pf_1")}
          </h2>
          <p className="mt-6 text-lg tracking-tight text-lime-100">
            {t("pf_2")}
          </p>
        </div>
        <Tab.Group
          as="div"
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === "vertical"}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        "group relative rounded-md px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6",
                        selectedIndex === featureIndex
                          ? "bg-white  lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10"
                          : "hover:bg-white/10 lg:hover:bg-white/5 border sm:border-none border-lime-700 bg-lime-600 sm:bg-transparent"
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            " text-lg [&:not(:focus-visible)]:focus:outline-none",
                            selectedIndex === featureIndex
                              ? "text-lime-600 lg:text-white"
                              : "text-lime-100 hover:text-white lg:text-white"
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          "mt-2 hidden text-sm lg:block",
                          selectedIndex === featureIndex
                            ? "text-white"
                            : "text-lime-100 group-hover:text-white"
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-7">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-zinc-50 shadow-xl shadow-lime-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <Image
                        className="w-full"
                        src={feature.image}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </Container>
    </section>
  );
}

function Feature({ feature, isActive, className, ...props }) {
  return (
    <div
      className={clsx(className, !isActive && "opacity-75 hover:opacity-100")}
      {...props}
    >
      <div
        className={clsx(
          "w-9 rounded-lg",
          isActive ? "bg-lime-600" : "bg-zinc-500"
        )}
      >
        <svg aria-hidden="true" className="h-9 w-9" fill="none">
          <feature.icon />
        </svg>
      </div>
      <h3
        className={clsx(
          "mt-6 text-sm font-medium",
          isActive ? "text-lime-600" : "text-zinc-600"
        )}
      >
        {feature.name}
      </h3>
      <p className="mt-2  text-xl text-zinc-900">{feature.summary}</p>
      <p className="mt-4 text-sm text-zinc-600">{feature.description}</p>
    </div>
  );
}

function FeaturesMobile() {
  const { t } = useTranslation("common");
  const secondaryFeatures = [
    {
      name: t("sfeat_t_1"),
      summary: t("sfeat_s_1"),
      description: t("sfeat_d_1"),
      image: screenshotProfitLoss,
      icon: function ReportingIcon() {
        const id = useId();
        return (
          <>
            <defs>
              <linearGradient
                id={id}
                x1="11.5"
                y1={18}
                x2={36}
                y2="15.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".194" stopColor="#fff" />
                <stop offset={1} stopColor="#6692F1" />
              </linearGradient>
            </defs>
            <path
              d="m30 15-4 5-4-11-4 18-4-11-4 7-4-5"
              stroke={`url(#${id})`}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      },
    },
    {
      name: t("sfeat_t_2"),
      summary: t("sfeat_s_2"),
      description: t("sfeat_d_2"),
      image: screenshotInventory,
      icon: function InventoryIcon() {
        return (
          <>
            <path
              opacity=".5"
              d="M8 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
              fill="#fff"
            />
            <path
              opacity=".3"
              d="M8 24a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
              fill="#fff"
            />
            <path
              d="M8 10a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
              fill="#fff"
            />
          </>
        );
      },
    },
    {
      name: t("sfeat_t_3"),
      summary: t("sfeat_s_3"),
      description: t("sfeat_d_3"),
      image: screenshotContacts,
      icon: function ContactsIcon() {
        return (
          <>
            <path
              opacity=".5"
              d="M25.778 25.778c.39.39 1.027.393 1.384-.028A11.952 11.952 0 0 0 30 18c0-6.627-5.373-12-12-12S6 11.373 6 18c0 2.954 1.067 5.659 2.838 7.75.357.421.993.419 1.384.028.39-.39.386-1.02.036-1.448A9.959 9.959 0 0 1 8 18c0-5.523 4.477-10 10-10s10 4.477 10 10a9.959 9.959 0 0 1-2.258 6.33c-.35.427-.354 1.058.036 1.448Z"
              fill="#fff"
            />
            <path
              d="M12 28.395V28a6 6 0 0 1 12 0v.395A11.945 11.945 0 0 1 18 30c-2.186 0-4.235-.584-6-1.605ZM21 16.5c0-1.933-.5-3.5-3-3.5s-3 1.567-3 3.5 1.343 3.5 3 3.5 3-1.567 3-3.5Z"
              fill="#fff"
            />
          </>
        );
      },
    },
  ];
  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {secondaryFeatures.map((feature) => (
        <div key={feature.name}>
          <Feature feature={feature} className="mx-auto max-w-2xl" isActive />
          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 bottom-0 top-8 bg-zinc-200 sm:-inset-x-6" />
            <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-500/10">
              <Image
                className="w-full"
                src={feature.image}
                alt=""
                sizes="52.75rem"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesDesktop() {
  const { t } = useTranslation("common");

  const secondaryFeatures = [
    {
      name: t("sfeat_t_1"),
      summary: t("sfeat_s_1"),
      description: t("sfeat_d_1"),
      image: screenshotProfitLoss,
      icon: function ReportingIcon() {
        const id = useId();
        return (
          <>
            <defs>
              <linearGradient
                id={id}
                x1="11.5"
                y1={18}
                x2={36}
                y2="15.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".194" stopColor="#fff" />
                <stop offset={1} stopColor="#6692F1" />
              </linearGradient>
            </defs>
            <path
              d="m30 15-4 5-4-11-4 18-4-11-4 7-4-5"
              stroke={`url(#${id})`}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      },
    },
    {
      name: t("sfeat_t_2"),
      summary: t("sfeat_s_2"),
      description: t("sfeat_d_2"),
      image: screenshotInventory,
      icon: function InventoryIcon() {
        return (
          <>
            <path
              opacity=".5"
              d="M8 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
              fill="#fff"
            />
            <path
              opacity=".3"
              d="M8 24a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
              fill="#fff"
            />
            <path
              d="M8 10a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
              fill="#fff"
            />
          </>
        );
      },
    },
    {
      name: t("sfeat_t_3"),
      summary: t("sfeat_s_3"),
      description: t("sfeat_d_3"),
      image: screenshotContacts,
      icon: function ContactsIcon() {
        return (
          <>
            <path
              opacity=".5"
              d="M25.778 25.778c.39.39 1.027.393 1.384-.028A11.952 11.952 0 0 0 30 18c0-6.627-5.373-12-12-12S6 11.373 6 18c0 2.954 1.067 5.659 2.838 7.75.357.421.993.419 1.384.028.39-.39.386-1.02.036-1.448A9.959 9.959 0 0 1 8 18c0-5.523 4.477-10 10-10s10 4.477 10 10a9.959 9.959 0 0 1-2.258 6.33c-.35.427-.354 1.058.036 1.448Z"
              fill="#fff"
            />
            <path
              d="M12 28.395V28a6 6 0 0 1 12 0v.395A11.945 11.945 0 0 1 18 30c-2.186 0-4.235-.584-6-1.605ZM21 16.5c0-1.933-.5-3.5-3-3.5s-3 1.567-3 3.5 1.343 3.5 3 3.5 3-1.567 3-3.5Z"
              fill="#fff"
            />
          </>
        );
      },
    },
  ];
  return (
    <Tab.Group as="div" className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          <Tab.List className="grid grid-cols-3 gap-x-8">
            {secondaryFeatures.map((feature, featureIndex) => (
              <Feature
                key={feature.name}
                feature={{
                  ...feature,
                  name: (
                    <Tab className="[&:not(:focus-visible)]:focus:outline-none">
                      <span className="absolute inset-0" />
                      {feature.name}
                    </Tab>
                  ),
                }}
                isActive={featureIndex === selectedIndex}
                className="relative"
              />
            ))}
          </Tab.List>
          <Tab.Panels className="relative mt-20 overflow-hidden rounded-3xl bg-zinc-200 px-14 py-16 xl:px-16">
            <div className="-mx-5 flex">
              {secondaryFeatures.map((feature, featureIndex) => (
                <Tab.Panel
                  key={feature.name}
                  static
                  className={clsx(
                    "px-5 transition duration-500 ease-in-out [&:not(:focus-visible)]:focus:outline-none",
                    featureIndex !== selectedIndex && "opacity-60"
                  )}
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                  aria-hidden={featureIndex !== selectedIndex}
                >
                  <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-500/10">
                    <Image
                      className="w-full"
                      src={feature.image}
                      alt=""
                      sizes="52.75rem"
                    />
                  </div>
                </Tab.Panel>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-zinc-900/10" />
          </Tab.Panels>
        </>
      )}
    </Tab.Group>
  );
}

export function SecondaryFeatures() {
  const { t } = useTranslation("common");
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className=" text-3xl tracking-tight text-zinc-900 sm:text-4xl">
            {t("slogan")}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-zinc-700">
            {t("slogan_desc")}
          </p>
        </div>
        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  );
}

export function Hero() {
  const { t } = useTranslation("common");

  return (
    <Container className="pb-20 pt-20 text-center lg:pb-32 lg:pt-32">
      <h1 className="mx-auto max-w-4xl text-4xl font-medium tracking-tight text-zinc-900 sm:text-6xl">
        {t("hero1")}{" "}
        <span className="relative whitespace-nowrap text-lime-600">
          <svg
            aria-hidden="true"
            viewBox="0 0 418 42"
            className="absolute left-0 top-2/3 h-[0.58em] w-full fill-lime-300/70"
            preserveAspectRatio="none"
          >
            <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
          </svg>
          <span className="relative">{t("hero2")}</span> <br />
        </span>{" "}
        {t("hero3")}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-zinc-700">
        {t("find_mates")}
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <Link href="/register">
          <Button variant="black">{t("start_free")}</Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <svg
                aria-hidden="true"
                className="h-3 w-3 flex-none fill-lime-600 group-active:fill-current"
              >
                <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
              </svg>
              <span className="ml-3">{t("open_video")}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-6 sm:max-w-6xl sm:w-[1200px] sm:h-[812px]">
            <iframe
              className="rounded-lg m-auto sm:w-[1024px]  w-[305px] sm:h-[712px] h-[370px] bg-slate-300"
              allowfullscreen="allowfullscreen"
              src="https://www.youtube.com/embed/Hlxassai_2k"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
}

export function Footer() {
  const { t } = useTranslation("common");
  return (
    <footer className="bg-zinc-50">
      <Container>
        <div className="py-16">
          <Logo className="mx-auto h-10 w-auto" />
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="#features">{t("opportunities")}</NavLink>
              <NavLink href="#testimonials">{t("reviews")}</NavLink>
              <NavLink href="#pricing">{t("prices")}</NavLink>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-zinc-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <Link
              href="https://www.facebook.com/limpid.kz"
              className="group"
              aria-label="TaxPal on Twitter"
            >
              <FacebookLogo className="h-8 w-8" />
            </Link>
            <Link
              href="https://www.tiktok.com/@lim_eurasian?_t=8Wi9zh8TNiA&_r=1"
              className="group"
              aria-label="TaxPal on GitHub"
            >
              <TiktokLogo className="h-8 w-8" />
            </Link>
            <Link
              href="https://www.instagram.com/limpid.kz/"
              className="group"
              aria-label="TaxPal on GitHub"
            >
              <InstagramLogo className="h-8 w-8" />
            </Link>
            <Link
              href="https://www.youtube.com/@limeurasian2409"
              className="group"
              aria-label="TaxPal on GitHub"
            >
              <YoutubeLogo className="h-8 w-8" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500 sm:mt-0">
            {t("copy_right")} <br /> {t("address")}
            <br />
            {t("IIN")}
          </p>
        </div>
      </Container>
    </footer>
  );
}

function SwirlyDoodle({ className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 281 40"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"
      />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={clsx(
        "h-6 w-6 flex-none fill-current stroke-current",
        className
      )}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pricing() {
  const { t } = useTranslation("common");

  const frequencies = [
    { value: "monthly", label: t("month"), priceSuffix: t("monthSuffix") },
    { value: "kvartal", label: t("quarter"), priceSuffix: t("quarterSuffix") },
    { value: "annually", label: t("year"), priceSuffix: t("yearSuffix") },
  ];

  const handlePayment = async (id) => {
    try {
      const { data: response } = await api.getInvoices(id);
      if (response.data) {
        halyk.pay({
          invoiceId: response.invoice.invoice_id,
          language: response.invoice.language,
          description: response.invoice.description,
          terminal: response.invoice.terminal,
          amount: response.invoice.amount,
          currency: response.invoice.currency,
          accountId: response.invoice.user_id,
          auth: response.data,
          postLink: response.invoice.post_link,
          failurePostLink: "https://limpid.kz",
          cardSave: true,
          backLink: "https://limpid.kz",
          failureBackLink: "",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast({
          title: "Вы не вошли в аккаунт",
          description: "Войдите в акканут",
          variant: "destructive",
          action: (
            <ToastAction altText="try">
              <a href="https://limpid.kz/login">Войти</a>
            </ToastAction>
          ),
        });
      } else {
        // Handle other errors
        console.error(error);
      }
    }
  };

  const tiers = [
    {
      name: "START",
      id: "tier-start",
      href: "#",
      price: {},
      description: t("price_start_desc"),
      features: {
        monthly: [
          t("price_start_feat_1"),
          t("price_start_feat_2"),
          t("price_start_feat_3"),
        ],
        annually: [
          t("price_start_feat_1"),
          t("price_start_feat_2"),
          t("price_start_feat_3"),
        ],
        kvartal: [
          t("price_start_feat_1"),
          t("price_start_feat_2"),
          t("price_start_feat_3"),
        ],
      },
      mostPopular: false,
    },
    {
      name: "LIGHT",
      id: "tier-light",
      href: {
        monthly: "1",
        annually: "3",
        kvartal: "2",
      },
      price: { monthly: "4990₸", annually: "37 990₸", kvartal: "12 990₸" },
      description: t("for_beginners"),
      features: {
        monthly: [
          t("price_start_feat_1"),
          t("price_start_feat_2_d", {
            project_count: "3",
          }),
          t("price_start_feat_3_d", {
            participation_count: "7",
            value_volume: "1 000 000",
          }),
        ],
        annually: [
          t("price_start_feat_1"),
          t("price_start_feat_2_d", {
            project_count: "3",
          }),
          t("price_start_feat_3_d", {
            participation_count: "84",
            value_volume: "1 000 000",
          }),
        ],
        kvartal: [
          t("price_start_feat_1"),
          t("price_start_feat_2_d", {
            project_count: "9",
          }),
          t("price_start_feat_3_d", {
            participation_count: "21",
            value_volume: "1 000 000",
          }),
        ],
      },
      mostPopular: false,
    },
    {
      name: "STANDART",
      id: "tier-standart",
      href: {
        monthly: "4",
        annually: "6",
        kvartal: "5",
      },
      price: { monthly: "8990", annually: "59 900₸", kvartal: "20 990₸" },
      description: t("strieve"),
      features: {
        monthly: [
          t("price_start_feat_1"),
          t("price_start_feat_2_d", {
            project_count: "5",
          }),
          t("price_start_feat_3_d", {
            participation_count: "15",
            value_volume: "5 000 000",
          }),
          "Бесплатная верификация",
          "Настройка видимости Профиля",
        ],
        annually: [
          t("price_start_feat_1"),
          t("price_start_feat_2_d", {
            project_count: "60",
          }),
          t("price_start_feat_3_d", {
            participation_count: "180",
            value_volume: "5 000 000",
          }),
          t("free_verification"),
          t("visibility"),
        ],
        kvartal: [
          t("price_start_feat_1"),
          t("price_start_feat_2_d", {
            project_count: "15",
          }),
          t("price_start_feat_3_d", {
            participation_count: "45",
            value_volume: "5 000 000",
          }),
          t("free_verification"),
          t("visibility"),
        ],
      },
      mostPopular: true,
    },
    {
      name: "VIP",
      id: "tier-VIP",
      href: {
        annually: "8",
        kvartal: "7",
      },
      price: { monthly: "", annually: "639 900₸", kvartal: "199900₸" },
      description: t("unlimit"),
      features: {
        monthly: [
          t("price_start_feat_1"),
          t("unlimit_project_create"),
          t("unlimited_access"),
          t("free_verification"),
          t("visibility"),
          t("personal_consult"),
          t("priority_support"),
          t("private_meet_SEO"),
        ],
        annually: [
          t("price_start_feat_1"),
          t("unlimit_project_create"),
          t("unlimited_access"),
          t("free_verification"),
          t("visibility"),
          t("personal_consult"),
          t("priority_support"),
          t("private_meet_SEO"),
        ],
        kvartal: [
          t("price_start_feat_1"),
          t("unlimit_project_create"),
          t("unlimited_access"),
          t("free_verification"),
          t("visibility"),
          t("personal_consult"),
          t("priority_support"),
          t("private_meet_SEO"),
        ],
      },
      mostPopular: false,
    },
  ];
  const handleFrequencyChange = (event) => {
    const selectedFrequency = frequencies.find(
      (freq) => freq.value === event.target.value
    );
    setFrequency(selectedFrequency);
  };

  const [frequency, setFrequency] = useState(frequencies[0]);

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-zinc-900 py-20 sm:py-32"
    >
      <Container>
        <div className="md:text-center">
          <h2 className=" text-3xl tracking-tight text-white sm:text-4xl">
            {t("pay_phrase_3")}
            <span className="relative whitespace-nowrap">
              <SwirlyDoodle className="absolute left-0 top-1/2 h-[1em] w-full fill-lime-400" />
              <span className="relative">{t("pay_phrase_1")}</span>
            </span>
            {t("pay_phrase_2")}
          </h2>
          <p className="mt-4 text-lg text-zinc-400">{t("pay_warranty")}</p>
        </div>
        <div className="mt-10 flex justify-center">
          <RadioGroup className="grid grid-cols-3 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white">
            {frequencies.map((freq) => (
              <label
                key={freq.value}
                className="flex items-center justify-around gap-2"
              >
                <input
                  type="radio"
                  name="frequency"
                  value={freq.value}
                  checked={frequency.value === freq.value}
                  className="hidden"
                  onChange={handleFrequencyChange}
                />
                <span
                  className={`flex items-center ${
                    frequency.value === freq.value
                      ? "text-white bg-lime-600 py-1 px-2  rounded-xl"
                      : "py-1 px-2 rounded-xl"
                  }`}
                >
                  {freq.label}
                </span>
              </label>
            ))}
          </RadioGroup>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {tiers.map((tier) => {
            if (tier.name === "VIP" && frequency.value === "monthly") {
              return (
                <div
                  key={tier.id}
                  className={classNames(
                    tier.mostPopular
                      ? "bg-white/5 ring-2 ring-lime-500"
                      : "ring-1 ring-white/10",
                    "rounded-3xl p-8 xl:p-10"
                  )}
                >
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={tier.id}
                      className="text-lg font-semibold leading-8 text-white"
                    >
                      {tier.name}
                    </h3>
                    {tier.mostPopular ? (
                      <p className="rounded-full bg-lime-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                        Популярный
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-300">
                    {tier.description} <br /> (доступен с квартала)
                  </p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10">
                    {tier.features[frequency.value].map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon
                          className="h-6 w-5 flex-none text-white"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div
                key={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? "bg-white/5 ring-2 ring-lime-500"
                    : "ring-1 ring-white/10",
                  "rounded-3xl p-8 xl:p-10"
                )}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className="text-lg font-semibold leading-8 text-white"
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-lime-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                      Популярный
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-300">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-3xl font-bold tracking-tight text-white">
                    {tier.price[frequency.value]}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-300">
                    {tier.name === "START" ? " " : frequency.priceSuffix}
                  </span>
                </p>
                {tier.name === "START" ? (
                  ""
                ) : (
                  <button
                    onClick={() => {
                      handlePayment(tier.href[frequency.value]);
                    }}
                    aria-describedby={tier.id}
                    className={classNames(
                      tier.mostPopular
                        ? "bg-lime-500 text-white shadow-sm hover:bg-lime-400 focus-visible:outline-lime-500"
                        : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                      "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    )}
                  >
                    {t("start_now")}
                  </button>
                )}
                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10">
                  {tier.features[frequency.value].map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-white"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function Logo(props) {
  return (
    <svg
      width="110"
      height="44"
      viewBox="0 0 110 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M60.1832 37.5798V15.1079H64.8654V33.6626H74.3595V37.5798H60.1832Z"
        fill="#1B1C1E"
      />
      <path
        d="M82.1424 15.1079V37.5798H77.4602V15.1079H82.1424Z"
        fill="#1B1C1E"
      />
      <path
        d="M85.9946 15.1079H91.7689L97.8676 30.2062H98.1272L104.226 15.1079H110V37.5798H105.459V22.9533H105.275L99.5437 37.47H96.4511L90.72 22.8984H90.5362V37.5798H85.9946V15.1079Z"
        fill="#1B1C1E"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.4489 21.2481C42.2953 9.48628 32.8529 0 21.2261 0C9.59932 0 0.156917 9.48628 0.00332099 21.2481L0 44C13.0158 39.9384 17.4294 27.8742 17.1612 20.27H14.7477C13.597 20.27 13.1254 20.2742 12.9004 20.2498C12.6878 20.227 12.4637 20.0872 12.3748 19.8664C12.3267 19.7476 12.2387 19.4831 12.4579 19.1908C12.56 19.0551 12.824 18.7712 16.6249 14.9144C20.4266 11.0567 20.757 10.6851 20.9098 10.6051C20.9803 10.568 21.0742 10.5234 21.2261 10.5217C21.378 10.5234 21.4719 10.568 21.5424 10.6051C21.6944 10.6851 22.0256 11.0575 25.8273 14.9144C29.629 18.7721 29.8922 19.0551 29.9943 19.1908C30.2135 19.4823 30.1255 19.7476 30.0774 19.8664C29.9885 20.0872 29.7635 20.2279 29.5518 20.2498C29.3268 20.2733 28.8552 20.27 27.7045 20.27H25.291C25.0228 27.8742 29.4364 39.9384 42.4522 44L42.4489 21.2481Z"
        fill="url(#paint0_linear_201_10917)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_201_10917"
          x1="21.3975"
          y1="43.8429"
          x2="21.3975"
          y2="1.00327e-07"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0ACF83" />
          <stop offset="0.549172" stopColor="#97F41D" />
          <stop offset="0.965574" stopColor="#BFFF00" stopOpacity="0.97" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-lg px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-zinc-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0"
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
}

function MobileNavigation() {
  const { t } = useTranslation("common");
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-zinc-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-zinc-900 shadow-xl ring-1 ring-zinc-900/5"
          >
            <MobileNavLink href="#features">{t("opportunities")}</MobileNavLink>
            <MobileNavLink href="#testimonials">{t("reviews")}</MobileNavLink>
            <MobileNavLink href="#pricing">{t("prices")}</MobileNavLink>
            <hr className="m-2 border-zinc-300/40" />
            <MobileNavLink href="/login">{t("log_in")}</MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.getUser();
        if (data) {
          setUserData(data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
        } else {
          console.error("An error occurred:", error);
        }
      }
    })();
  }, []);
  const { t } = useTranslation("common");

  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="#" aria-label="Home">
              <Logo className="h-10 w-auto" />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="#features">{t("opportunities")}</NavLink>
              <NavLink href="#testimonials">{t("reviews")}</NavLink>
              <NavLink href="#pricing">{t("prices")}</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              {userData ? (
                <NavLink href="/app/projects">
                  {userData.first_name} {userData.last_name}
                </NavLink>
              ) : (
                <NavLink href="/login">{t("log_in")}</NavLink>
              )}
            </div>

            {!userData && (
              <NavLink href="/register">
                <Button color="lime" className="hidden lg:inline rounded-lg">
                  {t("signup_today")}
                </Button>
              </NavLink>
            )}
            <div>
              <Select
                onValueChange={(newValue) =>
                  router.push(
                    {
                      pathname: router.pathname,
                      query: router.query,
                    },
                    null,
                    { locale: newValue }
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("chooseLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ru">Русский язык</SelectItem>
                    <SelectItem value="kz">Қазақ тілі</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default function Home() {
  const { t } = useTranslation("common");

  const testimonials = [
    [
      {
        content: t("testimonials_content_1"),
        author: {
          name: "Абзал Игиссин",
          role: "CEO KZGBKR",
          image: avatarImage1,
        },
      },
    ],
    [
      {
        content: t("testimonials_content_2"),
        author: {
          name: "Нұрбақыт Жүсіпәлиев",
          role: "Director SMART INVESTOR",
          image: avatarImage2,
        },
      },
    ],
    [
      {
        content: t("testimonials_content_3"),
        author: {
          name: "Куаныш Амангали",
          role: "Director Design Sensei",
          image: avatarImage3,
        },
      },
    ],
  ];
  return (
    <>
      <Header />
      <Hero />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <div className="bg-zinc-900 py-24 sm:py-32">
        <div className="relative isolate">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl flex-col gap-16 bg-white/5 px-6 py-16 ring-1 ring-white/10 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20">
              <Image
                className="h-96 w-full flex-none rounded-2xl object-contain lg:aspect-square lg:h-auto lg:max-w-sm"
                src={AstanaHub}
                alt=""
              />
              <div className="w-full flex-auto">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {t("hub_title")}
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  {t("hub_content")}
                </p>

                <div className="mt-10 flex">
                  <Link
                    target="_blank"
                    href="https://astanahub.com/ru/"
                    className="text-sm font-semibold leading-6 text-lime-400"
                  >
                    {t("hub_action")} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section
        id="testimonials"
        aria-label="What our customers are saying"
        className="bg-zinc-50 py-20 sm:py-32"
      >
        <Container>
          <div className="mx-auto max-w-2xl md:text-center">
            <h2 className=" text-3xl tracking-tight text-zinc-900 sm:text-4xl">
              {t("slogan_2")}
            </h2>
            <p className="mt-4 text-lg tracking-tight text-zinc-700">
              {t("slogan_2_content")}
            </p>
          </div>
          <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((column, columnIndex) => (
              <li key={columnIndex}>
                <ul className="flex flex-col gap-y-6 sm:gap-y-8">
                  {column.map((testimonial, testimonialIndex) => (
                    <li key={testimonialIndex}>
                      <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-zinc-900/10">
                        <QuoteIcon className="absolute left-6 top-6 fill-zinc-100" />
                        <blockquote className="relative">
                          <p className="text-lg tracking-tight text-zinc-900">
                            {testimonial.content}
                          </p>
                        </blockquote>
                        <figcaption className="relative mt-6 flex items-center justify-between border-t border-zinc-100 pt-6">
                          <div>
                            <div className=" text-base text-zinc-900">
                              {testimonial.author.name}
                            </div>
                            <div className="mt-1 text-sm text-zinc-500">
                              {testimonial.author.role}
                            </div>
                          </div>
                          <div className="overflow-hidden rounded-full bg-zinc-50">
                            <Image
                              className="h-14 w-14 object-cover"
                              src={testimonial.author.image}
                              alt=""
                              width={56}
                              height={56}
                            />
                          </div>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Pricing />
      <Footer />
    </>
  );
}
