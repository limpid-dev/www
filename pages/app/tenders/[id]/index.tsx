import { LinkSimple } from "@phosphor-icons/react";
import { GetStaticPropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../../../../api";
import { Navigation } from "../../../../components/Navigation";
import { Button } from "../../../../components/Primitives/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/Primitives/Dialog";
import {
  Field,
  Form,
  Input,
  Label,
} from "../../../../components/Primitives/Form";

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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!data.finishedAt}
                >
                  Принять участие
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ваша ставка</DialogTitle>
                </DialogHeader>
                <Form
                  onSubmit={async (event) => {
                    event.preventDefault();

                    const form = new FormData(event.currentTarget);

                    const values = Object.fromEntries(
                      form.entries()
                    ) as unknown as {
                      price: number;
                    };

                    const profileId = Number(localStorage.getItem("profileId"));

                    await api.tenders
                      .bids(data.id)
                      .store({ price: values.price, profileId });

                    await router.push(`/app/tenders/${data.id}/bids`);
                  }}
                >
                  <Field name="price">
                    <Label>Сумма</Label>
                    <Input
                      placeholder="KZT"
                      type="number"
                      min={1}
                      max={data.startingPrice}
                    />
                  </Field>
                  <DialogFooter className="mt-4">
                    <Button type="submit" className="rounded-lg">
                      Сделать ставку
                    </Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </>
  );
}
