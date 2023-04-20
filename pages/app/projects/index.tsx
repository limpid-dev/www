import { Faders, SquaresFour } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Navigation } from "../../../components/Navigation";
import { Button } from "../../../components/Primitives/Button";
import testAva from "../../../images/avatars/avatar-1.jpg";

const tabs = [
  { name: "Все проекты", href: "/app/projects/", current: true },
  { name: "Мои проекты", href: "/app/projects/my", current: false },
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
          <p className=" text-sm text-slate-300">Проекты</p>
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
                  placeholder="Искать по проектам"
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

          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/app/projects/[id]">
              <div className=" rounded-2xl border border-slate-200 bg-white hover:border-black">
                <div className="p-4">
                  <div className="grid w-full grid-cols-10 gap-4">
                    <div className="col-span-2">
                      <Image src={testAva} alt="test" className="rounded-lg" />
                    </div>
                    <div className="col-span-8 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <p className="text-xs font-semibold sm:text-base">
                          Техно пространство
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="max-w-[300px] text-xs sm:text-sm">
                          производство одежды, текстильных изделий, обуви
                        </p>
                        <p className="flex items-center rounded-2xl bg-lime-500 px-2 py-1 text-[9px] font-bold text-slate-100 sm:text-xs">
                          в ТОПе
                        </p>
                      </div>
                      <div className="mt-2 flex gap-4 text-xs">
                        <div className="flex w-fit items-center gap-4 rounded-lg bg-slate-100 p-2">
                          <Image
                            src={testAva}
                            alt="test"
                            width={20}
                            height={20}
                            className="rounded-lg"
                          />
                          <p className="text-xs sm:text-sm">Сара Алтыбекова</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
