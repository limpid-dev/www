import {
  CaretRight,
  ChatCircle,
  FileText,
  FileVideo,
} from "@phosphor-icons/react";
import Image from "next/image";
import testAva from "../../images/avatars/avatar-1.jpg";
import { Button } from "../Primitives/Button";

export default function General() {
  const handleClick = (event: any) => {
    setIsShown((current: boolean) => !current);
  };

  return (
    <div className="h-full bg-white px-6">
      <div className="flex flex-col items-center justify-center pt-12">
        <Image
          src={testAva}
          alt="Photo by Alvaro Pinot"
          className="h-[106px] w-auto rounded-md object-cover pb-6"
        />
        <p className=" text-2xl font-semibold">Almaz Nurgali</p>
        <p className=" text-sm">Гостиница для животных</p>
        <p className=" text-sm text-sky-500">Отзывы (5)</p>
      </div>
      <div className="mb-6 mt-3" />
      <div className="grid gap-3">
        <Button className="w-full">
          <div className="flex w-full items-center gap-3 text-sm font-semibold">
            <FileVideo /> Бизнес-план
          </div>
          <CaretRight />
        </Button>
        <Button className="w-full" onClick={handleClick}>
          <div className="flex w-full items-center gap-3 text-sm font-semibold">
            <ChatCircle /> Обсуждение проекта
          </div>
          <CaretRight />
        </Button>
      </div>
      <div className="mb-6 mt-4" />
      <div className="flex flex-col gap-4">
        <p className="w-fit rounded-xl bg-slate-100 p-2 text-sm">
          участников в проекте: 1
        </p>
      </div>
    </div>
  );
}
