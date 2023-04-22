import {
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "../../api";
import { Entity } from "../../api/profiles";
import Test from "../../images/avatars/avatar-1.jpg";

export function General({ portfolioId }: any) {
  const [data, setData] = useState<Entity>();

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await api.profiles.show(portfolioId);
      if (data) {
        setData(data);
      }
    }
    fetchProfiles();
  }, [portfolioId]);

  return (
    <div className="h-full bg-white px-6">
      <div className="flex flex-col items-center justify-center pt-12">
        <Image
          src={Test}
          alt="Photo by Alvaro Pinot"
          className="mb-3 h-[106px] w-auto  object-cover"
        />
        <p className=" text-2xl font-semibold">Almaz</p>
        <p className=" text-sm">{data?.industry}</p>
        {/* <p className=" text-sm text-sky-500">Отзывы (5)</p> */}
      </div>
      <div className="mb-6 mt-3" />
      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <p className=" text-sm text-slate-400"> Локация</p>
          <p className="text-sm">{data?.location}</p>
        </div>
        <div>
          <p className=" text-sm text-slate-400">Профессия</p>
          <p className="text-sm">{data?.title}</p>
        </div>
      </div>
      <div className="mb-6 mt-4" />
      <div className="">
        <p className=" text-lg font-semibold">Обо мне</p>
        <p className="pt-3  text-sm">{data?.description}</p>
      </div>
      <div className="mb-5 mt-3" />
      <div>
        <p className=" mb-4 text-lg font-semibold"> Социальные сети</p>
        <div className="flex gap-6 pb-5">
          <LinkedinLogo />
          <YoutubeLogo />
          <InstagramLogo />
        </div>
      </div>
    </div>
  );
}
