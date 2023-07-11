import { Plus } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../../../api";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/primitives/card";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { data: session } = await api.getUser({
    headers: {
      Cookie: context.req.headers.cookie,
    },
  });

  const { data: tenders } = await api.getTenders({
    query: {
      page: 1,
      per_page: 10,
      profile_id: session.data.selected_profile_id,
    },
  });

  return {
    props: {
      ...tenders!,
    },
  };
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const calcTime = (date: string) => {
  const now = new Date();
  const finish = new Date(date);
  const diff = finish.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

const tabs = [
  { name: "Все закупки", href: "/app/tenders", current: false },
  { name: "Мои закупки", href: "/app/tenders/my", current: true },
];

export default function TendersMy({ data }: Props) {
  const router = useRouter();

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 py-8">
          <p className=" text-sm text-slate-300">Мои закупки</p>
          <div className="my-5 flex flex-col items-end justify-end gap-4 md:mb-12 md:flex-row md:items-center  md:justify-between">
            <div>
              <div className="sm:hidden">
                <select
                  onChange={handleSelectChange}
                  id="tabs"
                  name="tabs"
                  className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                  defaultValue="/app/tenders/my"
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
            </div>{" "}
            <Link href="/app/tenders/create">
              <Button variant="black">
                <Plus className="h-6 w-6" />
                Создать закупки
              </Button>
            </Link>
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
                      <span>Осталось дней:</span>
                      <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                        {tender.finishedAt
                          ? calcTime(tender.finishedAt)
                          : "---"}
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
    </>
  );
}
