import { Faders, MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import api from "../../../api";
import { GeneralLayout } from "../../../components/general-layout";
import { Navigation } from "../../../components/navigation";
import Pagination from "../../../components/pagination";
import { Button } from "../../../components/primitives/button";
import { Options } from "../../../components/primitives/options";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/primitives/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/primitives/sheet";
import getImageSrc from "../../../hooks/get-image-url";
import DefaultAvatar from "../../../images/avatars/defaultProfile.svg";

const tabs = [
  { name: "Все профили", href: "/app/profiles/", current: true },
  { name: "Мои профили", href: "/app/profiles/my", current: false },
];

export default function Profiles() {
  const router = useRouter();
  const [profilesData, setProfilesData] = useState<any[]>([]);
  const [profilesMeta, setProfilesMeta] = useState<any>({});
  const [totalItems, setTotalItems] = useState<any>(1);
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };
  const currentPage =
    (Number.parseInt(router.query.page as string, 10) as number) || 1;

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

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

  const handleReset = () => {
    setSelectedCheckboxes([]);
    setSearchTerm("");
  };

  const handleCheckboxChange = (event) => {
    const value = Number(event.target.value);
    if (selectedCheckboxes.includes(value)) {
      setSelectedCheckboxes(selectedCheckboxes.filter((id) => id !== value));
    } else {
      setSelectedCheckboxes([...selectedCheckboxes, value]);
    }
  };

  const handleSearch = useCallback(async () => {
    const industries = selectedCheckboxes
      .map((id) => {
        const option = Options.find((option) => option.id === id);
        return option ? option.name : null;
      })
      .filter(Boolean);

    const { data } = await api.getProfiles({
      page: currentPage,
      per_page: 9,
      industry: industries,
      search: searchTerm,
    });
    setProfilesData(data.data);
    setProfilesMeta(data.meta);
    setTotalItems(data.meta.total);
  }, [selectedCheckboxes, currentPage, searchTerm]);

  useEffect(() => {
    handleSearch();
  }, [selectedCheckboxes, searchTerm, handleSearch]);

  return (
    <div>
      <Navigation />
      <GeneralLayout>
        <p className="text-sm text-slate-300">Профили</p>
        <div className="my-5 flex flex-col items-end justify-end gap-4 md:mb-12 md:flex-row md:justify-between">
          <div>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                onChange={handleSelectChange}
                id="tabs"
                name="tabs"
                className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
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
          <div className="flex justify-end flex-wrap gap-3">
            <div className="flex rounded-md border">
              <input
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
                <MagnifyingGlass className="w-6 h-6 text-black" />
              </Button>
            </div>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Faders className="h-6 w-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-md p-3">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      className="rounded-md"
                    />
                    <p className="text-sm">Сначала новые</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-md p-3 mt-3">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      className="rounded-md"
                    />
                    <p className="text-sm">Сначала старые</p>
                  </div>
                </PopoverContent>
              </Popover>
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

        <div className="grid gap-6 sm:grid-cols-3">
          <React.Fragment>
            {profilesData.map((profile, profileIndex) => {
              if (!profile.is_visible) {
                return (
                  <div
                    key={profileIndex}
                    className="rounded-lg border border-slate-200 bg-white p-4 hover:border-black"
                  >
                    <div className="grid grid-cols-10 h-[140px]">
                      <div className="col-span-4 mr-3">
                        <Image
                          src={
                            getImageSrc(profile?.avatar?.url) ?? DefaultAvatar
                          }
                          width={0}
                          height={0}
                          unoptimized
                          alt="test"
                          className="h-32 w-32 rounded-lg object-cover bg-slate-100"
                        />
                      </div>
                      <div className="col-span-6 flex flex-col gap-1">
                        <p>{profile.display_name}</p>
                        <p className="line-clamp-1">
                          {profile.user?.first_name} {profile.user?.last_name}
                        </p>
                        <p className="line-clamp-1 w-auto text-xs text-slate-600">
                          {profile.industry}
                        </p>
                        <p className="line-clamp-2 w-auto text-xs text-slate-500">
                          {profile.title}
                        </p>
                        <p className="line-clamp-2 w-auto text-sm text-slate-400">
                          {profile.location}
                        </p>
                        <p className="line-clamp-2 text-xs">
                          {profile.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link key={profileIndex} href={`/app/profiles/${profile.id}`}>
                  <div className="rounded-lg border border-slate-200 bg-white p-4 hover:border-black">
                    <div className="grid grid-cols-10 h-[140px]">
                      <div className="col-span-4 mr-3">
                        <Image
                          src={
                            getImageSrc(profile?.avatar?.url) ?? DefaultAvatar
                          }
                          width={0}
                          height={0}
                          unoptimized
                          alt="test"
                          className="h-32 w-32 rounded-lg object-cover"
                        />
                      </div>
                      <div className="col-span-6 flex flex-col gap-1">
                        <p>{profile.display_name}</p>
                        <p className="line-clamp-1">
                          {profile.user?.first_name} {profile.user?.last_name}
                        </p>
                        <p className="line-clamp-1 w-auto text-xs text-slate-600">
                          {profile.industry}
                        </p>
                        <p className="line-clamp-2 w-auto text-xs text-slate-500">
                          {profile.title}
                        </p>
                        <p className="line-clamp-2 w-auto text-sm text-slate-400">
                          {profile.location}
                        </p>
                        <p className="line-clamp-2 text-xs">
                          {profile.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </React.Fragment>
        </div>
      </GeneralLayout>
      <Pagination
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={9}
        renderPageLink={(page) => `/app/profiles/?page=${page}`}
        firstPageUrl={profilesMeta.first_page_url}
        lastPageUrl={profilesMeta.last_page_url}
        nextPageUrl={profilesMeta.next_page_url}
        previousPageUrl={profilesMeta.previous_page_url}
      />
    </div>
  );
}
