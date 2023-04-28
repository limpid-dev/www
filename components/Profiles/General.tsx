import Image from "next/image";
import { useEffect, useState } from "react";
import api from "../../api";
import { Entity } from "../../api/profiles";
import Test from "../../images/avatars/defaultProfile.svg";

export function General({ profileId }: any) {
  const [data, setData] = useState<Entity>();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await api.profiles.show(profileId);
      if (data) {
        setData(data);
      }
      const { data: user } = await api.users.show(data?.userId);
      if (user) {
        setUserData(user);
      }
    }
    fetchProfiles();
  }, [profileId]);

  return (
    <div className="h-full bg-white px-6">
      <div className="flex flex-col items-center justify-center pt-12">
        <Image
          src={Test}
          alt="Photo by Alvaro Pinot"
          className="mb-3 h-[106px] w-auto rounded-md object-cover"
        />
        <p className=" text-2xl font-semibold">
          {userData.firstName} {userData.lastName}
        </p>
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
      {/* <div>
        <p className=" mb-4 text-lg font-semibold"> Социальные сети</p>
        <div className="flex gap-6 pb-5">
          <LinkedinLogo />
          <YoutubeLogo />
          <InstagramLogo />
        </div>
      </div> */}
    </div>
  );
}
