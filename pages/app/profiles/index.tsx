import { Eye, MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import api from "../../../api";
import { components } from "../../../api/api-paths";
import { CreateChatButton } from "../../../components/chats/create-chat-button";
import { GeneralLayout } from "../../../components/general-layout";
import { Navigation } from "../../../components/navigation";
import Pagination from "../../../components/pagination";
import { Button } from "../../../components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/primitives/card";
import { Input } from "../../../components/primitives/input";
import { Options } from "../../../components/primitives/options";
import { Separator } from "../../../components/primitives/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/primitives/sheet";
import { Skeleton } from "../../../components/primitives/skeleton";
import getImageSrc from "../../../hooks/get-image-url";
import DefaultAvatar from "../../../images/avatars/defaultProfile.svg";
import IncognitoProfile from "../../../images/avatars/incognitoProfile.png";

const tabs = [
  { name: "Все профили", href: "/app/profiles/", current: true },
  { name: "Мои профили", href: "/app/profiles/my", current: false },
];

export default function Profiles() {
  const router = useRouter();
  const currentPage =
    (Number.parseInt(router.query.page as string, 10) as number) || 1;
  const [loading, setLoading] = useState(true);

  const [profilesData, setProfilesData] = useState<
    components["schemas"]["Profile"][]
  >([]);
  const [profilesMeta, setProfilesMeta] = useState<
    components["schemas"]["Pagination"]
  >({});

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = useCallback(async () => {
    const industries = selectedCheckboxes
      .map((id) => {
        const option = Options.find((option) => option.id === id);
        return option ? option.name : null;
      })
      .filter(Boolean) as string[];

    const { data } = await api.getProfiles({
      page: currentPage,
      per_page: 9,
      industry: industries,
      search: searchTerm,
    });

    setProfilesData(data.data);
    setProfilesMeta(data.meta);
    setLoading(false);
  }, [selectedCheckboxes, currentPage, searchTerm]);

  useEffect(() => {
    handleSearch();
  }, [selectedCheckboxes, searchTerm, handleSearch]);

  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchUser() {
      const { data: sessionData } = await api.getUser();
      if (sessionData.data.id) {
        setUser(sessionData.data);
      }
    }
    fetchUser();
  }, []);

  const handleReset = () => {
    setSelectedCheckboxes([]);
    setSearchTerm("");
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (selectedCheckboxes.includes(value)) {
      setSelectedCheckboxes(selectedCheckboxes.filter((id) => id !== value));
    } else {
      setSelectedCheckboxes([...selectedCheckboxes, value]);
    }
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  return (
    <div>
      <Navigation />
      <GeneralLayout>
        <div className="my-5 flex flex-col items-center justify-center gap-4 md:mb-12 md:flex-row md:justify-between">
          <div>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                onChange={handleSelectChange}
                id="tabs"
                name="tabs"
                className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500 rounded-md"
                defaultValue="/app/profiles/"
              >
                {tabs.map((tab) => (
                  <option key={tab.name} value={tab.href}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={clsx(
                      tab.current
                        ? "bg-lime-100 text-lime-700 rounded-md"
                        : "text-gray-500 hover:text-gray-700",
                      " px-3 py-2 text-sm font-medium"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
          <div className="flex justify-center items-center flex-wrap gap-3">
            <div className="flex rounded-md border">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                placeholder="Искать по проектам"
                className="rounded-lg border-none"
              />
              <Button
                onClick={handleSearch}
                className=" bg-transparent ring-0 ring-transparent hover:bg-slate-100 active:bg-slate-200"
              >
                <MagnifyingGlass className="w-5 h-5 text-black" />
              </Button>
            </div>
            <div className="flex gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <SquaresFour className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  position="right"
                  size={largeScreen ? "default" : "full"}
                >
                  <SheetHeader>
                    <SheetTitle>Сфера деятельности</SheetTitle>
                    <SheetDescription>
                      Выберите сферы деятельности интересующие вас
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid grid-cols-2 gap-4 py-4 overflow-auto h-[74%] sm:h-[85%]">
                    {Options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 bg-slate-50 rounded-md p-3"
                      >
                        <input
                          type="checkbox"
                          value={option.id}
                          checked={selectedCheckboxes.includes(option.id)}
                          onChange={handleCheckboxChange}
                          className="rounded-md"
                        />
                        <p className="text-sm">{option.name}</p>
                      </div>
                    ))}
                  </div>
                  <SheetFooter
                    className={clsx("flex justify-between gap-3 pt-3")}
                  >
                    <DialogPrimitive.Close aria-label="Close" asChild>
                      <Button
                        type="reset"
                        variant="outline"
                        onClick={handleReset}
                        className="w-full"
                      >
                        Сбросить
                      </Button>
                    </DialogPrimitive.Close>
                    <DialogPrimitive.Close aria-label="Close" asChild>
                      <Button
                        type="submit"
                        className={clsx(
                          " bg-slate-900 text-white hover:bg-slate-800 w-full"
                        )}
                        variant="subtle"
                      >
                        Применить
                      </Button>
                    </DialogPrimitive.Close>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-3">
            <Skeleton className=" h-[204px] rounded-full" />
            <Skeleton className=" h-[204px] rounded-full" />
            <Skeleton className=" h-[204px] rounded-full" />
            <Skeleton className=" h-[204px] rounded-full" />
            <Skeleton className=" h-[204px] rounded-full" />
            <Skeleton className=" h-[204px] rounded-full" />
            <Skeleton className=" h-[204px] rounded-full" />
            <Skeleton className=" h-[204px] rounded-full" />
            <Skeleton className=" h-[204px] rounded-full" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3">
            <React.Fragment>
              {profilesData.map((profile) => {
                if (!profile.is_visible) {
                  return (
                    <div
                      key={profile.id}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="grid grid-cols-10">
                        <div className="col-span-4 mr-3">
                          <Image
                            src={IncognitoProfile}
                            width={0}
                            height={0}
                            unoptimized
                            alt="test"
                            className="h-32 w-32 rounded-lg object-cover bg-slate-100"
                          />
                        </div>
                        <div className="col-span-6 flex flex-col gap-1">
                          <p className="line-clamp-1 ">
                            {profile.display_name}
                          </p>
                          <p className="line-clamp-1 w-auto text-xs text-slate-600">
                            {profile.industry}
                          </p>
                          <p>Скрытый профиль</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Card
                    key={profile.id}
                    onClick={() => {
                      router.push(`/app/profiles/${profile.id}`);
                    }}
                    className="cursor-pointer border hover:border-black"
                  >
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-10">
                        <div className="col-span-4 mr-3">
                          <Image
                            src={
                              getImageSrc(profile.avatar?.url) ?? DefaultAvatar
                            }
                            width={0}
                            height={0}
                            unoptimized
                            alt="test"
                            className="h-32 w-32 rounded-lg object-cover"
                          />
                        </div>
                        <div className="col-span-6 flex flex-col gap-[11px]">
                          <p>{profile.display_name}</p>
                          <p className="line-clamp-1 w-auto text-xs text-slate-600">
                            {profile.industry}
                          </p>
                          <div className="flex gap-10">
                            <p className="line-clamp-1 text-xs text-slate-400">
                              {profile.created_at &&
                                new Date(profile.created_at).toLocaleDateString(
                                  "ru-RU",
                                  {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                  }
                                )}
                            </p>
                            <p className="line-clamp-1 text-xs flex gap-2 items-center text-slate-400">
                              <Eye className="w-4 h-4" /> {profile.views}
                            </p>
                          </div>
                          <CreateChatButton
                            userIds={[user?.id, profile.user_id]}
                            name={`${user?.first_name} ${user?.last_name}, ${profile.user?.first_name} ${profile.user?.last_name}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </React.Fragment>
          </div>
        )}
      </GeneralLayout>{" "}
      {profilesMeta.total !== undefined && (
        <Pagination
          totalItems={profilesMeta.total}
          currentPage={currentPage}
          itemsPerPage={9}
          renderPageLink={(page) => `/app/profiles/?page=${page}`}
          firstPageUrl={profilesMeta.first_page_url}
          lastPageUrl={profilesMeta.last_page_url}
        />
      )}
    </div>
  );
}
