import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bell, List, X } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import api from "../api";
import { Entity } from "../api/profiles";
import testAva from "../images/avatars/avatar-1.jpg";
import { Logo } from "./Logo";
import { Button } from "./Primitives/Button";

function findById(array, id) {
  for (const element of array) {
    if (element.id === id) {
      return element;
    }
  }
  return null;
}
const user = {
  name: "Debbie Lewis",
  handle: "deblewis",
  email: "debbielewis@example.com",
  imageUrl: "",
};

const navigation = [
  { name: "Проекты", href: "/app/projects" },
  { name: "Профили", href: "/app/profiles" },
  // { name: "Аукционы", href: "/app/auctions" },
  { name: "Тендеры", href: "/app/tenders" },
];

const userNavigation = [
  // { name: "Your Profile", href: "#" },
  // { name: "Settings", href: "#" },
  // { name: "Выйти", href: "#" },
];

export function Navigation() {
  const router = useRouter();
  const [profilesData, setProfilesData] = useState<Entity[]>([]);
  const [profession, setProfession] = useState("");

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

      if (data) {
        if (data[0]?.id && localStorage.length === 0) {
          localStorage.setItem("portfolioId", JSON.stringify(data[0].id));
        }
        const myObject = findById(
          data,
          Number.parseInt(localStorage.getItem("portfolioId"), 10)
        );
        setProfession(myObject.title);
        console.log(profilesData)
        setProfilesData(data);
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
                <button
                  type="button"
                  className="flex-shrink-0 rounded-full bg-white p-1 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full"
                        width={8}
                        height={8}
                        src={testAva}
                        alt=""
                      />
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
                                  "portfolioId",
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
                      <Button
                        onClick={handleLogout}
                        className="flex w-full items-start justify-start rounded-none px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
                        color="white"
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
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-zinc-500">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block  px-3 py-2 text-base font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <Button
                  onClick={handleLogout}
                  className="flex w-full rounded-none px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                  color="white"
                >
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
