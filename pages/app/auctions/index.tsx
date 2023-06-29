import { Faders, SquaresFour } from "@phosphor-icons/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../api";
import { components } from "../../../api/api-paths";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";

const tabs = [
  { name: "Все продажи", href: "/app/auctions/", current: true },
  { name: "Мои продажи", href: "/app/auctions/my", current: false },
];

export default function All() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const [auctions, setAuctions] = useState<components["schemas"]["Auction"][]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await api.getAuctions({
          page: 1,
          per_page: 9,
        });
        setAuctions(response.data.data || []);
        setLoading(false);
      } catch (error) {
        setError("Error fetching tenders.");
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <>
      <Navigation />
      <div className="h-screen bg-slate-50 px-5 pt-8">
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
            <div className="flex flex-wrap items-end justify-end gap-3">
              <div className="flex rounded-lg border">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="search"
                  placeholder="Искать по аукционам"
                  className="rounded-lg border-none"
                />
                <Button
                  type="submit"
                  className=" bg-transparent ring-0 ring-transparent hover:bg-slate-100 active:bg-slate-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="black"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </Button>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Faders className="h-6 w-6" />
                </Button>
                <Button variant="outline">
                  <SquaresFour className="h-6 w-6" />
                </Button>
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
      {/* {profilesMeta.total !== undefined && (
        <Pagination
          totalItems={profilesMeta.total}
          currentPage={currentPage}
          itemsPerPage={9}
          renderPageLink={(page) => `/app/profiles/?page=${page}`}
          firstPageUrl={profilesMeta.first_page_url}
          lastPageUrl={profilesMeta.last_page_url}
        />
      )} */}
    </>
  );
}
