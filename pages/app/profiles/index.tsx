import {
  AdjustmentsVerticalIcon,
  DocumentMagnifyingGlassIcon,
  MagnifyingGlassCircleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../../../components/Button";
import { Navigation } from "../../../components/Navigation";
import testAva from "../../../images/avatars/avatar-1.jpg";

export default function All() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <Navigation />
      <div className="h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <p className=" text-sm text-slate-300">Профили</p>
          <div className="my-5 flex flex-col items-end justify-end gap-4 md:mb-12 md:flex-row md:items-baseline md:justify-end">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-lg border">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="search"
                  placeholder="Искать по закупкам"
                  className="rounded-lg border-none"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="ring-transparent"
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
              <Button variant="outline">
                <AdjustmentsVerticalIcon className="h-6 w-6" />
              </Button>
              <Button variant="outline">
                <Squares2X2Icon className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="profiles/user/1">
              <div className="rounded-lg border border-slate-200 bg-white p-4 hover:border-black">
                <div className="grid grid-cols-10">
                  <div className="col-span-4">
                    <Image
                      src={testAva}
                      alt="test"
                      className=" h-32 w-32 rounded-lg"
                    />
                  </div>
                  <div className="col-span-6 flex flex-col gap-1">
                    <p>Алмаз Нургали</p>

                    <p className="text-xs text-slate-400">Веб разработка</p>
                    <p className="text-sm text-slate-400">Астана</p>

                    <p className="line-clamp-3 w-44 text-xs">
                      Как веб-разработчик, я приверженец постоянного
                      профессионального роста и самосовершенствования. Я владею
                      широким спектром технологий и языков программирования,
                      таких как HTML, CSS, JavaScript, PHP и MySQL, а также имею
                      опыт работы с фреймворками и библиотеками, такими как
                      React, Angular и Bootstrap.
                    </p>
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
