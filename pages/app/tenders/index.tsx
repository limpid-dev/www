import { Check, Faders, SquaresFour } from "@phosphor-icons/react";
import clsx from "clsx";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import api from "../../../api";
import { Navigation } from "../../../components/Navigation";
import { Button } from "../../../components/Primitives/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/Primitives/Card";

export async function getStaticProps() {
  const { data, meta, error } = await api.tenders.index({
    page: 1,
    perPage: 9,
  });

  console.log(data, meta, error);

  return {
    props: {
      data: data!,
      meta: meta!,
    },
  };
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const tabs = [
  { name: "Все проекты", href: "/app/projects/", current: true },
  { name: "Мои проекты", href: "/app/projects/my", current: false },
];

export default function Tenders({ data, meta }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-screen-xl px-5 pt-8">
        <p className=" text-sm text-slate-300">Тендеры</p>
        <div className="my-5 flex flex-col items-end  justify-end gap-4 md:mb-12 md:flex-row md:items-center  md:justify-between">
          <div>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Выберите таб
              </label>
              <select
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
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <li>
            <Card>
              <CardHeader>
                <CardTitle>#120 Менеджер по туризму</CardTitle>
                <CardDescription>ТОО Поехали с нами</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-sm font-medium">
                    <span>Статус:</span>
                    <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                      В процессе
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-sm font-medium">
                    <span>Осталось:</span>
                    <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                      9 часов
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-sm font-medium">
                    <span>Участников:</span>
                    <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                      3
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-sm font-medium">
                    <span>Стартовая сумма:</span>
                    <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                      440 000 KZT
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="#" className="w-full">
                  <Button variant="outline" className="w-full">
                    Принять участие
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </li>
        </ul>
      </div>
    </div>
  );
}
