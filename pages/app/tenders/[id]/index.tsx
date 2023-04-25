import { LinkSimple } from "@phosphor-icons/react";
import { GetStaticPropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import api from "../../../../api";
import { Navigation } from "../../../../components/Navigation";
import { Button } from "../../../../components/Primitives/Button";

const calcTime = (date: string) => {
  const now = new Date();

  const finish = new Date(date);

  const diff = finish.getTime() - now.getTime();

  const hours = Math.floor(diff / 1000 / 60 / 60);

  return hours > 0 ? hours : 0;
};

export const getServerSideProps = async (
  context: GetStaticPropsContext<{
    id: string;
  }>
) => {
  const { data } = await api.tenders.show(Number(context.params!.id));

  const { data: files } = await api.tenders
    .files(Number(context.params!.id))
    .index({ page: 1, perPage: 100 });

  if (!data) {
    return {
      notFound: true,
    };
  }

  const { data: profile } = await api.profiles.show(data!.profileId);

  const { data: user } = await api.users.show(profile!.userId);

  return {
    props: {
      data: {
        ...data!,
        user: user!,
        profile: profile!,
        files: files!,
      },
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Tender({ data }: Props) {
  return (
    <>
      <Navigation />
      <main className="flex h-[calc(100%-65px)] w-full items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-screen-sm rounded-lg border border-slate-200 bg-white px-8 pb-8 pt-12">
          {/* <p className="whitespace-pre text-xs">
            {JSON.stringify(data, null, 2)}
          </p> */}
          <span className="text-base font-medium text-slate-400">
            #{data.id}
          </span>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">{data.title}</h1>
            <p className="text-sm text-slate-400">{data.description}</p>
            <p className="text-sm text-slate-400">
              {data.user.firstName} {data.user.lastName}
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="flex-1 rounded-lg bg-slate-100 px-3 pb-2 pt-8">
              <span className="text-lg font-medium text-black">
                {data.finishedAt ? "На модерации" : "В процессе"}
              </span>
              <p className="text-sm text-slate-900">Статус</p>
            </div>
            <div className="flex-1 rounded-lg bg-slate-100 px-3 pb-2 pt-8">
              <span className="text-lg font-medium text-black">
                {data.finishedAt ? `${calcTime(data.finishedAt)} часов` : "---"}
              </span>
              <p className="text-sm text-slate-900">Осталось</p>
            </div>
            <div className="flex-1 rounded-lg bg-slate-100 px-3 pb-2 pt-8">
              <span className="text-lg font-medium text-black">
                {data.startingPrice
                  ? new Intl.NumberFormat("kz-KZ", {
                      style: "currency",
                      currency: "KZT",
                    }).format(data.startingPrice)
                  : "---"}{" "}
              </span>
              <p className="text-sm text-slate-900">Стартовая сумма</p>
            </div>
          </div>
          <hr className="mt-8 border-slate-200" />
          <div className="mt-6 text-lg font-semibold text-black">
            Документация
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {data.files.map((file) => (
              <Link
                key={file.id}
                href={file.url}
                target="_blank"
                className="flex flex-nowrap items-center justify-between gap-2 rounded-lg bg-slate-100 px-5 py-4 text-sm text-black"
              >
                <span className="w-full truncate">{file.name}</span>
                <LinkSimple className="h-6 w-6" />
              </Link>
            ))}
          </div>
          <div className="pt-4" />
          <div className="w-full border-t border-slate-200 pt-4">
            <Button
              variant="outline"
              className="w-full disabled:cursor-not-allowed disabled:opacity-60"
              disabled
            >
              Принять участие
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
