import { Check, Faders, SquaresFour } from "@phosphor-icons/react";
import clsx from "clsx";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../../../api";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/primitives/card";

const calcTime = (date: string) => {
  const now = new Date();

  const finish = new Date(date);

  const diff = finish.getTime() - now.getTime();

  const hours = Math.floor(diff / 1000 / 60 / 60);

  return hours > 0 ? hours : 0;
};

export async function getServerSideProps() {
  const { data, meta } = await api.tenders.index({
    page: 1,
    perPage: 100,
  });

  return {
    props: {
      data: data!,
      meta: meta!,
    },
  };
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const tabs = [
  { name: "Все закупки", href: "/app/tenders", current: true },
  { name: "Мои закупки", href: "/app/tenders/my", current: false },
];

export default function Tenders({ data, meta }: Props) {
  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-screen-xl px-5 py-8">
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
                <option value="/app/tenders">Все продажи</option>
                <option value="/app/tenders/my">Мои продажи</option>
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
          {/* <div className="flex flex-wrap items-end justify-end gap-3">
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
          </div> */}
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((tender) => (
            <Card
              key={tender.id}
              onClick={() => {
                router.push(`/app/tenders/${tender.id}`);
              }}
              className="cursor-pointer"
            >
              <CardHeader>
                <CardTitle>
                  #{tender.id} {tender.title}
                </CardTitle>
                <CardDescription>{tender.description}</CardDescription>
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
                    <span>Осталось часов:</span>
                    <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                      {tender.finishedAt ? calcTime(tender.finishedAt) : "---"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-sm font-medium">
                    <span>Стартовая сумма:</span>
                    <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                      {tender.startingPrice
                        ? new Intl.NumberFormat("kz-KZ", {
                            style: "currency",
                            currency: "KZT",
                          }).format(tender.startingPrice)
                        : "---"}{" "}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
