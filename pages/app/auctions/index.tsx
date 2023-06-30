import { Faders, MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import api from "../../../api";
import { components } from "../../../api/api-paths";
import { Navigation } from "../../../components/navigation";
import Pagination from "../../../components/pagination";
import { Button } from "../../../components/primitives/button";
import { Options } from "../../../components/primitives/options";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/primitives/sheet";

const tabs = [
  { name: "Все продажи", href: "/app/auctions/", current: true },
  { name: "Мои продажи", href: "/app/auctions/my", current: false },
];

export default function All() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const currentPage =
    (Number.parseInt(router.query.page as string, 10) as number) || 1;
  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const [auctions, setAuctions] = useState<components["schemas"]["Auction"][]>(
    []
  );

  const [auctionsMeta, setAuctionsMeta] = useState<
    components["schemas"]["Pagination"]
  >({});

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

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);

  const handleSearch = useCallback(async () => {
    const industries = selectedCheckboxes
      .map((id) => {
        const option = Options.find((option) => option.id === id);
        return option ? option.name : null;
      })
      .filter(Boolean);

    const { data } = await api.getAuctions({
      page: currentPage,
      per_page: 9,
      industry: industries,
      search: searchTerm,
    });

    setAuctions(data.data);
    setAuctionsMeta(data.meta);
    setLoading(false);
  }, [selectedCheckboxes, currentPage, searchTerm]);

  useEffect(() => {
    handleSearch();
  }, [selectedCheckboxes, searchTerm, handleSearch]);

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

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-50 px-5 pt-8">
        <div className="mx-auto max-w-screen-xl">
          <p className=" text-sm text-slate-300">Продажи</p>
          <div className="my-5 flex flex-col items-center justify-end gap-4 md:mb-12 md:flex-row  md:justify-between">
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
                  defaultValue={tabs.find((tab) => tab.current)?.name}
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
                          ? "bg-lime-100 text-lime-700"
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

          <div className="grid justify-center gap-6 md:grid-cols-2 lg:grid-cols-3">
            {auctions.map((auction) => (
              <Link
                key={auction.id}
                href={auction.verified_at ? `/app/auctions/${auction.id}` : "#"}
              >
                <div className="min-w-[300px] rounded-2xl border border-slate-200 bg-white md:w-auto hover:border hover:border-black">
                  <div className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="mb-2.5 flex flex-row justify-between">
                        <div className="flex gap-2">
                          <p className="text-sm">{auction.type}</p>
                          <p className="text-base text-slate-400" />
                        </div>
                        <p className=" text-sm text-slate-400">
                          {auction.created_at &&
                            new Date(auction.created_at).toLocaleDateString(
                              "ru-RU",
                              {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                              }
                            )}
                        </p>
                      </div>
                      <div className="mb-2.5 flex flex-row justify-between">
                        <p className="text-base font-semibold">
                          {auction.title}
                        </p>
                        {/* <p className="rounded-2xl bg-lime-500 px-2 py-1 text-xs font-bold text-slate-100">
                        в ТОПе
                      </p> */}
                      </div>
                      <div className="grid grid-cols-2 gap-y-2.5">
                        <p className="text-sm text-slate-400">Статус</p>
                        <p className="w-fit items-center justify-center rounded-2xl bg-sky-50 px-2 pt-0.5 text-center text-xs text-sky-500">
                          {auction.verified_at ? "Опубликован" : "На модерации"}
                        </p>
                        <p className="text-sm text-slate-400">Прием заявок</p>
                        <p className="w-fit items-center justify-center rounded-2xl bg-sky-50 px-2 pt-0.5 text-center text-xs text-sky-500">
                          до{" "}
                          {auction.finishedAt &&
                            new Date(auction.finishedAt).toLocaleDateString(
                              "ru-RU",
                              {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                              }
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {auctionsMeta.total !== undefined && (
        <Pagination
          totalItems={auctionsMeta.total}
          currentPage={currentPage}
          itemsPerPage={9}
          renderPageLink={(page) => `/app/auctions/?page=${page}`}
          firstPageUrl={auctionsMeta.first_page_url}
          lastPageUrl={auctionsMeta.last_page_url}
        />
      )}
    </>
  );
}
