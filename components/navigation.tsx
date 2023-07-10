import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bell, List, X, XCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, SVGProps, useEffect, useState } from "react";
import api from "../api";
import { components } from "../api/api-paths";
import getImageSrc from "../hooks/get-image-url";
import testAva from "../images/avatars/defaultProfile.svg";
import { Button } from "./primitives/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./primitives/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./primitives/popover";
import { Separator } from "./primitives/separator";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={clsx(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Продажи",
    href: "/app/auctions",
    description:
      "Аукцион продаж - процесс конкурентной продажи товаров или услуг, где участники предлагают наивысшую цену за лоты, предоставленные продавцом.",
  },
  {
    title: "Закупки",
    href: "/app/tenders",
    description:
      "Аукцион закупок - это процесс конкурентного приобретения товаров или услуг, где потенциальные поставщики соревнуются друг с другом, предлагая наилучшие условия и цены для выполнения заказа.",
  },
];

export function Logo(props: SVGProps<SVGSVGElement>) {
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

const navigation = [
  { name: "Проекты", href: "/app/projects" },
  { name: "Профили", href: "/app/profiles" },
  { name: "Организации", href: "/app/organizations" },
  { name: "Продажи", href: "/app/auctions" },
  { name: "Закупки", href: "/app/tenders" },
  { name: "Чаты", href: "/app/chats" },
];

const userNavigation = [{ name: "Настройки", href: "/app/settings" }];

export function Navigation() {
  const router = useRouter();
  const [profilesData, setProfilesData] = useState<
    components["schemas"]["Profile"][]
  >([]);
  const [sessionData, setSessionData] =
    useState<components["schemas"]["User"]>();
  const [foundObject, setFoundObject] =
    useState<components["schemas"]["Profile"]>();
  const [profession, setProfession] = useState<string>();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [notifications, setNotifications] = useState<
    components["schemas"]["Notification"][]
  >([]);
  const handleMarkAsRead = (notificationId: number) => {
    api
      .markNotificationAsRead(notificationId)
      .then((response) => {
        // Handle the successful response
        console.log("Notification marked as read:", response.data);
        // Perform any additional actions if needed
      })
      .catch((error) => {
        // Handle errors
        console.error("Error marking notification as read:", error);
      });
  };
  useEffect(() => {
    async function fetchProfiles() {
      const { data: sessionData } = await api.getUser();
      if (sessionData.data.id) {
        setSessionData(sessionData.data);

        const { data: profiles } = await api.getProfiles({
          user_id: sessionData.data.id,
          page: 1,
        });

        const { data: organizations } = await api.getOrganizations({
          user_id: sessionData.data.id,
          page: 1,
        });

        if (profiles.data.length > 0 || organizations.data.length > 0) {
          const mergedArray = profiles.data.concat(organizations.data);
          setProfilesData(mergedArray);
          if (sessionData.data.selected_profile_id !== null) {
            const foundObject = mergedArray.find(
              (item) => item.id === sessionData.data.selected_profile_id
            );
            setFoundObject(foundObject);
            setAvatarUrl(getImageSrc(foundObject?.avatar?.url));
            setProfession(foundObject?.display_name);
          }

          if (sessionData.data.selected_profile_id === null) {
            await api
              .updateUser({
                selected_profile_id: mergedArray[0].id,
              })
              .then(() => {
                const foundObject = mergedArray.find(
                  (item) => item.id === sessionData.data.selected_profile_id
                );
                setAvatarUrl(getImageSrc(foundObject?.avatar?.url));
                setProfession(foundObject?.display_name);
              });
          }
        }
      }
    }
    fetchProfiles();
  }, []);

  useEffect(() => {
    const page = 1; // Replace with the desired page number
    const perPage = 10; // Replace with the desired number of notifications per page

    api
      .getNotifications(page, perPage)
      .then((response) => {
        // Handle the successful response
        const notificationsData = response.data.data || [];
        setNotifications(notificationsData);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error retrieving notifications:", error);
      });
  }, []);

  const handleLogout = async () => {
    await api.logoutUser();
    await router.push({
      pathname: "/",
    });
  };

  return (
    <Disclosure as="header" className="border-b bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-screen-xl lg:divide-y lg:divide-zinc-200">
            <div className="relative flex h-16 justify-between">
              <div className="relative z-10 flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <Logo />
                  </Link>
                </div>
              </div>

              <nav
                className="hidden lg:flex lg:space-x-8 lg:py-2"
                aria-label="Global"
              >
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Профили</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[400px] lg:grid-cols-1">
                          <ListItem
                            href="/app/profiles/my"
                            title="Ваши профили"
                          >
                            Ваши профиля покажите себя всему миру
                          </ListItem>
                          <ListItem href="/app/profiles" title="Профили">
                            Найдите интересующих вас людей
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Организации</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[400px] lg:grid-cols-1">
                          <ListItem
                            href="/app/organizations/my"
                            title="Ваши организации"
                          >
                            Ваши организации - создайте команду мечты
                          </ListItem>
                          <ListItem
                            href="/app/organizations/"
                            title="Организации"
                          >
                            Найдите интересующие вас компании
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Аукционы</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[400px] md:grid-cols-1">
                          {components.map((component) => (
                            <ListItem
                              key={component.title}
                              title={component.title}
                              href={component.href}
                            >
                              {component.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/app/projects" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Проекты
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/app/chats" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Чаты
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
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
                <Popover>
                  <PopoverTrigger className="p-3 border mr-3 rounded-full hover:bg-slate-50">
                    <Bell className="w-4 h-4 hover:text-slate-700 " />
                  </PopoverTrigger>
                  <PopoverContent className="max-h-[500px] overflow-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id}>
                        <Link
                          href={`/app/projects/${notification.meta.project_id}`}
                        >
                          <div className="relative bg-slate-100 hover:bg-slate-200 max-w-[280px] p-3 rounded-md mb-3">
                            <button
                              className="absolute top-0 right-0 block"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <p className="text-xs font-semibold">
                              {notification.title}
                            </p>
                            <p className="text-xs">
                              {notification.description}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>

                <Separator orientation="vertical" className="mr-3" />
                {profilesData[0]?.display_name ? (
                  <p className="mr-3 rounded-md bg-slate-100 p-2 text-sm text-slate-700 px-4 text-ellipsis w-24 whitespace-nowrap overflow-hidden">
                    {profession}
                  </p>
                ) : (
                  <p className="mr-3 rounded-md bg-slate-100 p-2 px-4 w-24 h-9" />
                )}
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full object-cover"
                        width={10}
                        unoptimized
                        height={10}
                        src={foundObject?.avatar?.url ? avatarUrl : testAva}
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right  bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none rounded-md">
                      {profilesData.map((item) => (
                        <Menu.Item key={item.id}>
                          {({ active }) => (
                            <button
                              className={clsx(
                                active ? "bg-zinc-100" : "",
                                "block w-full px-4 py-2 text-sm text-zinc-700"
                              )}
                              onClick={() => {
                                api.updateUser({
                                  selected_profile_id: item.id,
                                });
                                setProfession(item.display_name);
                                router.reload();
                              }}
                            >
                              {item.legal_structure ? item.legal_structure : ""}{" "}
                              {item.display_name}
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
                    className="h-8 w-8 rounded-full object-cover"
                    width={10}
                    unoptimized
                    height={10}
                    src={foundObject?.avatar?.url ? avatarUrl : testAva}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-zinc-800">
                    {sessionData?.first_name} {sessionData?.last_name}
                  </div>
                  <div className="text-sm font-medium text-zinc-500">
                    {sessionData?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
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
