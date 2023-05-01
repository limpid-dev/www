import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import api from "../../../../../api";
import { Entity } from "../../../../../api/tender-bid";
import { Navigation } from "../../../../../components/navigation";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const data = await api.tenders
    .bids(Number.parseInt(context!.params!.id as string, 10))
    .index({ page: 1, perPage: 100 });

  const tender = await api.tenders.show(
    Number.parseInt(context!.params!.id as string, 10)
  );

  const profile = await api.profiles.show(tender!.data!.profileId);

  const user = await api.users.show(profile.data!.userId);

  return {
    props: {
      data: data!.data!,
      tender: { ...tender!.data!, user: user.data! },
    },
  };
};

const calcTime = (date: string) => {
  const now = new Date();

  const finish = new Date(date);

  const diff = finish.getTime() - now.getTime();

  const hours = Math.floor(diff / 1000 / 60 / 60);

  return hours > 0 ? hours : 0;
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function TenderBids({ data, tender }: Props) {
  const router = useRouter();
  const [a, setData] = useState<Entity[]>(data);

  const id = router.query.id as string;

  useEffect(() => {
    const interval = setInterval(() => {
      if (id !== undefined && id !== null && id !== "") {
        api.tenders
          .bids(Number.parseInt(id, 10))
          .index({ page: 1, perPage: 100 })
          .then((data) => {
            setData(data.data!);
          });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navigation />
      <main className="flex h-[calc(100%-65px)] w-full items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-screen-sm rounded-lg border border-slate-200 bg-white px-8 pb-8 pt-12">
          <span className="text-base font-medium text-slate-400">
            #{tender.id}
          </span>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              {tender.title}
            </h1>
            <p className="text-sm text-slate-400">{tender.description}</p>
            <p className="text-sm text-slate-400">
              {tender.user.firstName} {tender.user.lastName}
            </p>
          </div>

          <table className="mt-8 w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Время создания
                </th>
                <th scope="col" className="px-6 py-3">
                  Сумма
                </th>
              </tr>
            </thead>
            <tbody>
              {a.map((bid) => (
                <tr
                  key={bid.id}
                  className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    {new Date(bid.updatedAt).toLocaleString()}
                  </th>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat("kz-KZ", {
                      style: "currency",
                      currency: "KZT",
                    }).format(bid.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
