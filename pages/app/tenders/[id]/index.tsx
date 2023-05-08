import { LinkSimple, ShieldWarning } from "@phosphor-icons/react";
import { GetStaticPropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/primitives/dialog";
import {
  Field,
  Form,
  Input,
  Label,
} from "../../../../components/primitives/form";

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
  const router = useRouter();
  return (
    <>
      <Navigation />
      <main className="min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">
              Аукционы / Продажи / {data.title}
            </span>
          </h1>

          <div className="">
            <div>
              <ShieldWarning className="w-6 h-6" /> Объявление на рассмотрении у
              модератора: 1 день
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
