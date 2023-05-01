import Image from "next/image";
import { useEffect, useState } from "react";
import api from "../../api";
import { Entity } from "../../api/projects";
import testAva from "../../images/avatars/defaultProfile.svg";

export default function General({ projectId }: any) {
  const [project, setProject] = useState<Entity>();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await api.projects.show(projectId);
      if (data) {
        setProject(data);
      }

      const { data: user } = await api.users.show(data?.profileId);
      if (user) {
        setUserData(user);
      }
    }
    fetchProfiles();
  }, [projectId]);

  return (
    <div className="h-full bg-white px-6 pb-6">
      <div className="flex flex-col items-center justify-center pt-12">
        <Image
          src={testAva}
          alt="Photo by Alvaro Pinot"
          className="mb-6 h-[106px] w-auto rounded-md object-cover"
        />
        <p className=" text-2xl font-semibold">
          {userData.firstName} {userData.lastName}
        </p>
        <p className=" text-sm">{project?.industry}</p>
      </div>
      <div className="mb-6 mt-3" />
      {/* <div className="grid gap-3">
        <Button className="w-full rounded-lg" variant="solid" color="white">
          <div className="flex w-full items-center gap-3 text-sm font-semibold">
            <FileVideo /> Бизнес-план
          </div>
          <CaretRight />
        </Button>
        <Button
          className="w-full rounded-lg"
          onClick={handleClick}
          variant="solid"
          color="white"
        >
          <div className="flex w-full items-center gap-3 text-sm font-semibold">
            <ChatCircle /> Обсуждение проекта
          </div>
          <CaretRight />
        </Button>
      </div> */}
      <div className="mb-6 mt-4" />
      <div className="flex flex-col gap-4">
        <p className="w-fit rounded-lg bg-slate-100 px-3 py-2 text-sm">
          участников в проекте: 1
        </p>
      </div>
    </div>
  );
}
