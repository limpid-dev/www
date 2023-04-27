import { CaretRight, Faders, SquaresFour } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Navigation } from "../../../components/Navigation";
import { Button } from "../../../components/Primitives/Button";

const tabs = [
  { name: "Все аукционы", href: "/app/auctions/", current: true },
  { name: "Мои аукционы", href: "/app/auctions/my", current: false },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function All() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };
  return (
    <div>
      <Navigation />
      <div className="h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <p className=" text-sm text-slate-300">Профили</p>
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
                      className={classNames(
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
                  placeholder="Искать по профилям"
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
            <div className="min-w-[300px] rounded-2xl border border-slate-200 bg-white md:w-auto">
              <div className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="mb-2.5 flex flex-row justify-between">
                    <div className="flex gap-2">
                      <p className="text-sm">#121</p>
                      <p className="text-base text-slate-400">Поехали с нами</p>
                    </div>
                    <p className=" text-sm text-slate-400">02.01.2023</p>
                  </div>
                  <div className="mb-2.5 flex flex-row justify-between">
                    <p className="text-base font-semibold">
                      Менеджер по туризму
                    </p>
                    <p className="rounded-2xl bg-lime-500 px-2 py-1 text-xs font-bold text-slate-100">
                      в ТОПе
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5">
                    <p className="text-sm text-slate-400">Заявки</p>
                    <p className="w-fit items-center justify-center rounded-2xl bg-sky-50 px-2 pt-0.5 text-center text-xs text-sky-500">
                      5
                    </p>
                    <p className="text-sm text-slate-400">Статус</p>
                    <p className="w-fit items-center justify-center rounded-2xl bg-sky-50 px-2 pt-0.5 text-center text-xs text-sky-500">
                      опубликован
                    </p>
                    <p className="text-sm text-slate-400">Прием заявок</p>
                    <p className="w-fit items-center justify-center rounded-2xl bg-sky-50 px-2 pt-0.5 text-center text-xs text-sky-500">
                      до 24.01.2023, 14:00
                    </p>
                  </div>
                </div>
                <div className="my-6" />
                <div className="flex items-center justify-end">
                  <Link href="/auctions/user/create">
                    <Button className="rounded-full bg-slate-300 px-2 py-1.5 hover:bg-black">
                      <CaretRight />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
