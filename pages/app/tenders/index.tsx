import { Faders, MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import api from "../../../api";
import { components } from "../../../api/api-paths";
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
  { name: "Все закупки", href: "/app/tenders", current: true },
  { name: "Мои закупки", href: "/app/tenders/my", current: false },
];

const calcTime = (date: string) => {
  const now = new Date();
  const finish = new Date(date);
  const diff = finish.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

export default function Tenders() {
  const router = useRouter();

  const currentPage =
    (Number.parseInt(router.query.page as string, 10) as number) || 1;
  const [tenders, setTenders] = useState<components["schemas"]["Tender"][]>([]);

  const [tendersMeta, setTendersMeta] = useState<
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
      .filter(Boolean) as string[];

    const { data } = await api.getTenders({
      query: {
        page: currentPage,
        per_page: 9,
        industry: industries,
        search: searchTerm,
      },
    });

    setTenders(data.data);
    setTendersMeta(data.meta);
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

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-50 px-5 pt-8">
        <div className="mx-auto max-w-screen-xl">
          <p className=" text-sm text-slate-300">Закупки</p>
          <div className="my-5 flex flex-col items-end  justify-end gap-4 md:mb-12 md:flex-row md:items-center  md:justify-between">
            <div>
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Выберите таб
                </label>
                <select
                  onChange={handleSelectChange}
                  id="tabs"
                  name="tabs"
                  className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                  defaultValue="/app/tenders"
                >
                  <option value="/app/tenders">Все закупки</option>
                  <option value="/app/tenders/my">Мои закупки</option>
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tenders.map((tender) => (
              <Card
                key={tender.id}
                onClick={() => {
                  if (tender.verified_at) {
                    router.push(`/app/tenders/${tender.id}`);
                  }
                }}
                className={`${
                  tender.verified_at
                    ? " cursor-pointer border hover:border-black"
                    : "unverified-class border"
                }`}
              >
                <CardHeader>
                  <CardTitle>
                    #{tender.id} {tender.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {tender.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-sm font-medium">
                      <span>Статус:</span>
                      <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                        {tender.finishedAt &&
                          new Date(tender.finishedAt).getTime() > Date.now() &&
                          "Идет"}
                        {!tender.finishedAt && "На модерации"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-sm font-medium">
                      <span>Осталось дней:</span>
                      <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                        {tender.finishedAt
                          ? calcTime(tender.finishedAt)
                          : "---"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {tendersMeta.total !== undefined && (
        <Pagination
          totalItems={tendersMeta.total}
          currentPage={currentPage}
          itemsPerPage={9}
          renderPageLink={(page) => `/app/tenders/?page=${page}`}
          firstPageUrl={tendersMeta.first_page_url}
          lastPageUrl={tendersMeta.last_page_url}
        />
      )}
    </>
  );
}
