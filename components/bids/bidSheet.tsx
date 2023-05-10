import { Sun } from "@phosphor-icons/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import api from "../../api";
import { Entity } from "../../api/tender-bid";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../primitives/sheet";

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

export function TenderBids({ data, tender }: Props) {
  const [a, setData] = useState<Entity[]>(data);

  useEffect(() => {
    const interval = setInterval(() => {
      api.tenders
        .bids(3)
        .index({ page: 1, perPage: 100 })
        .then((data) => {
          setData(data.data!);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <div className="bg-lime-50 p-3 rounded-md cursor-pointer border">
            <div className="flex justify-end">
              <Sun className="w-6 h-6 text-slate-400" />
            </div>
            <p className=" font-medium text-lg mt-4">0</p>
            <p className="text-sm text-slate-500 font-medium">Ставки</p>
          </div>
        </SheetTrigger>
        <SheetContent position="right" size="sm">
          <SheetHeader>
            <SheetTitle>Ставки</SheetTitle>
          </SheetHeader>
          <div className="flex justify-between my-5 bg-slate-100 p-4 rounded-md ">
            <div className="flex gap-4">
              {/* {a.map((bid) => (
                <div key={bid.id}>
                  <p>{bid.price}</p>
                </div>
              ))} */}
              {/* <Image
                src={tender.user.file.url}
                width={0}
                height={0}
                unoptimized
                className="object-cover w-6 h-6"
                alt=""
              /> */}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
