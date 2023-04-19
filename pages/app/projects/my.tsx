import {
  Chat,
  Eye,
  Faders,
  Pen,
  SquaresFour,
  Star,
  TagChevron,
  Trash,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Navigation } from "../../../components/Navigation";
import { Button } from "../../../components/Primitives/Button";
import testAva from "../../../images/avatars/avatar-1.jpg";

const tabs = [
  { name: "Все проекты", href: "/app/projects/", current: false },
  { name: "Мои проекты", href: "/app/projects/my", current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function All() {
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(true);

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
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                  id="tabs"
                  name="tabs"
                  className="block w-full rounded-md border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                  defaultValue={tabs.find((tab) => tab.current).name}
                >
                  {tabs.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
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
                        "rounded-md px-3 py-2 text-sm font-medium"
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
                  variant="outline"
                  className="ring-0 ring-transparent"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
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

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="grid items-center justify-center gap-4 rounded-lg border py-6 pl-6 pr-4 sm:grid-cols-10">
              <div className="sm:col-span-4 ">
                <Image
                  src={testAva}
                  className="m-auto w-[126px] rounded-lg"
                  alt="test"
                />
              </div>
              <div className="sm:col-span-6">
                <div className="flex flex-col gap-1">
                  <h1 className=" text-lg font-semibold">Кофейня-библиотека</h1>
                  <p className=" text-sm">рестораны, кафе, бары и т.д.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
