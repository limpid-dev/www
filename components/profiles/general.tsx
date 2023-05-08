import Image from "next/image";
import { useEffect, useState } from "react";
import api from "../../api";
import { Entity } from "../../api/profiles";
import * as User from "../../api/users";
import DefaultAva from "../../images/avatars/defaultProfile.svg";
import { Skeleton } from "../primitives/skeleton";

export function General({ profileId }: any) {
  const [profileData, setProfileData] = useState<Entity>();
  const [userData, setUserData] = useState<User.Show["Data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await api.profiles.show(profileId);
      if (data) {
        setProfileData(data);
        const { data: user } = await api.users.show(data.userId);
        if (user) {
          setUserData(user);
          setLoading(false);
        }
      }
    }
    fetchProfiles();
  }, [profileId]);

  return (
    <div className="h-full bg-white px-6">
      <div className="flex flex-col items-center justify-center pt-12">
        {loading ? (
          <Skeleton className="h-[106px] w-[110px] rounded-md" />
        ) : (
          <Image
            src={userData?.file ? userData.file.url : DefaultAva}
            width={0}
            height={0}
            unoptimized
            alt="Profile image"
            className="mb-3 h-[106px] w-auto rounded-md object-cover"
          />
        )}
        <p className="text-2xl font-semibold">
          {userData?.firstName} {userData?.lastName}
        </p>
        <p className=" text-sm">{profileData?.industry}</p>
      </div>
      <div className="mb-6 mt-3" />
      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <p className="text-sm text-slate-400">Локация</p>
          <p className="text-sm ">{profileData?.location}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Профессия</p>
          <p className="text-sm">{profileData?.title}</p>
        </div>
      </div>
      <div className="mb-6 mt-4" />
      <div>
        <p className="text-lg font-semibold">Обо мне</p>
        <p className="pt-3 text-sm">{profileData?.description}</p>
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
