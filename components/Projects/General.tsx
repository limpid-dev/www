import { CaretRight, ChatCircle, FileVideo } from "@phosphor-icons/react";
import Image from "next/image";
import testAva from "../../images/avatars/avatar-1.jpg";
import { Button } from "../Primitives/Button";

export default function General() {
  const handleClick = (event: any) => {};

  return (
    <div className="h-full bg-white px-6 pb-6">
      <div className="flex flex-col items-center justify-center pt-12">
        <Image
          src={testAva}
          alt="Photo by Alvaro Pinot"
          className="mb-6 h-[106px] w-auto rounded-md object-cover"
        />
        <p className=" text-2xl font-semibold">Almaz Nurgali</p>
        <p className=" text-sm">Гостиница для животных</p>
      </div>
      <div className="mb-6 mt-3" />
      <div className="grid gap-3">
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
      </div>
      <div className="mb-6 mt-4" />
      <div className="flex flex-col gap-4">
        <p className="w-fit rounded-lg bg-slate-100 px-3 py-2 text-sm">
          участников в проекте: 1
        </p>
      </div>
    </div>
  );
}
