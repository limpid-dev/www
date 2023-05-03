import { Disclosure, Menu, Transition } from "@headlessui/react";
import { List, X } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import api from "../api";
import { Entity } from "../api/profiles";
import { Entity as UserEntity } from "../api/users";
import testAva from "../images/avatars/defaultProfile.svg";
import { Button } from "./primitives/button";
import { Skeleton } from "./primitives/skeleton";

export function Logo(props: any) {
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

function findById(array: any, id: any) {
  for (const element of array) {
    if (element.id === id) {
      return element;
    }
  }
  return null;
}

const navigation = [
  { name: "Проекты", href: "/app/projects" },
  { name: "Профили", href: "/app/profiles" },
  { name: "Организации", href: "/app/organizations" },
  // { name: "Аукционы", href: "/app/auctions" },
  { name: "Тендеры", href: "/app/tenders" },
];

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
];

export function Navigation() {
  const router = useRouter();
  const [profilesData, setProfilesData] = useState<Entity[]>([]);
  const [profession, setProfession] = useState("");
  const [user, setUser] = useState<UserEntity>();
  const [test, setTest] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      const sessionData = await api.session.show();
      const userId = sessionData.data?.id;
      const { data } = await api.profiles.index({
        page: 1,
        perPage: 100,
        filters: {
          userId: userId || 0,
        },
      });
      setUser(sessionData.data);

      const { data: userData } = await api.users.show(userId);
      setTest(userData);

      if (data) {
        if (data[0]?.id && localStorage.length === 0) {
          localStorage.setItem("profileId", JSON.stringify(data[0].id));
        }
        const myObject = findById(
          data,
          Number.parseInt(localStorage.getItem("profileId") as string, 10)
        );
        setProfession(myObject?.title);
        setProfilesData(data);
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  const handleLogout = async () => {
    await api.session.destroy();

    await router.push({
      pathname: "/",
    });
  };

  return (
    <Disclosure as="header" className="border-b bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-zinc-200 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="relative z-10 flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <Logo />
                </div>
              </div>

              <nav
                className="hidden lg:flex lg:space-x-8 lg:py-2"
                aria-label="Global"
              >
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center  px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <div className="relative z-10 flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center  p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-900">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <List className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                {profession ? (
                  <p className="mr-3 rounded-md bg-lime-400 p-2 text-sm">
                    {profession}
                  </p>
                ) : (
                  ""
                )}
                {/* <button
                  type="button"
                  className="flex-shrink-0 rounded-full bg-white p-1 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      {loading ? (
                        <Skeleton className="h-8 w-8 rounded-full" />
                      ) : (
                        <Image
                          className="h-8 w-8 rounded-full object-cover"
                          width={0}
                          unoptimized
                          height={0}
                          src={test?.file?.url ? test.file.url : testAva}
                          alt=""
                        />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right  bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {profilesData.map((item) => (
                        <Menu.Item key={item.id}>
                          {({ active }) => (
                            <button
                              className={clsx(
                                active ? "bg-zinc-100" : "",
                                "block w-full px-4 py-2 text-sm text-zinc-700"
                              )}
                              onClick={() => {
                                localStorage.setItem(
                                  "profileId",
                                  JSON.stringify(item.id)
                                );
                                setProfession(item.title);
                              }}
                            >
                              {item.title}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                      <Link href="/app/settings">
                        <Button variant="link" className="w-full text-left">
                          Настройки
                        </Button>
                      </Link>
                      <Button
                        onClick={handleLogout}
                        variant="link"
                        className="w-full text-left"
                      >
                        Выйти
                      </Button>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block  px-3 py-2 text-base font-medium text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-zinc-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Image
                    className="h-10 w-10 rounded-full"
                    width={10}
                    height={10}
                    src={testAva}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-zinc-800">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm font-medium text-zinc-500">
                    {user?.email}
                  </div>
                </div>
                {/* <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button> */}
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Button onClick={handleLogout} className="flex w-full">
                  Выйти
                </Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
