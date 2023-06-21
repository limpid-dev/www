import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { Paperclip } from "@phosphor-icons/react";
import Uppy from "@uppy/core";
import Russian from "@uppy/locales/lib/ru_RU";
import { DashboardModal } from "@uppy/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../api";
// import { buildFormData } from "../../../../api/files";
import TechBuilder from "../../../../components/auctions/techBuilder";
import { GeneralLayout } from "../../../../components/general-layout";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { Input } from "../../../../components/primitives/input";
import { Separator } from "../../../../components/primitives/separator";

interface FormValues {
  title: string;
  description: string;
  finishedAt: string;
  startingPrice: number;
  purchasePrice: number;
}

const uppy = new Uppy({
  locale: Russian,
  restrictions: {
    allowedFileTypes: [".jpg", ".jpeg", ".png"],
    maxNumberOfFiles: 5,
    maxFileSize: 1024 * 1024 * 8,
  },
});

export default function Create() {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm({});
  const [fileDashboardOpen, setFileDashboardOpen] = useState(false);
  const { auctionId } = router.query;
  const parsedId = Number.parseInt(auctionId as string, 10) as number;

  const onSubmit = async () => {
    const numberWords = ["one", "two", "three", "four", "five"];

    const newObject = {};
    uppy.getFiles().forEach((item, index) => {
      const propertyName = `photo_${numberWords[index]}`;
      const { data: file, ...rest } = item;
      newObject[propertyName] = file;
    });

    console.log(newObject);
    const { data } = await api.updateAuction(parsedId, newObject);
    console.log(data);
  };
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    uppy.on("dashboard:modal-closed", () => setFileDashboardOpen(false));
  }, []);

  useEffect(() => {
    uppy.on("file-added", () => setFileCount(uppy.getFiles().length));
    uppy.on("file-removed", () => setFileCount(uppy.getFiles().length));
  }, []);

  return (
    <>
      <Navigation />
      <GeneralLayout>
        <h1 className="text-sm">
          <span className="text-slate-300">Аукцион / </span>
          Создание аукциона продаж
        </h1>

        <div className="flex items-baseline justify-between">
          <h1 className="pt-7 text-5xl  font-extrabold">{/* Профиль */}</h1>
        </div>

        <div className="rounded-lg bg-white shadow-sm">
          <div className="flex divide-x overflow-auto gap-4 px-5">
            <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-lg sm:text-xl">
              Общие данные
            </div>
            <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-lg sm:text-xl">
              Документация
            </div>
          </div>
          <div className="max-w-screen-md mx-auto p-8">
            <div className="font-semibold text-black text-2xl">
              Важные файлы
            </div>
            <p className="text-sm text-black mt-3">
              Загрузите дополнительные материалы
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="py-8">
              <div className="grid items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="space-x-2"
                  onClick={() => setFileDashboardOpen(true)}
                >
                  <Paperclip weight="bold" className="h-4 w-4 text-zinc-800" />
                  <span>Загрузить картинки</span>
                  <span className="font-semibold">
                    {fileCount > 0 && `${fileCount} выбран(о)`}
                  </span>
                </Button>
                <DashboardModal
                  proudlyDisplayPoweredByUppy={false}
                  hideUploadButton
                  open={fileDashboardOpen}
                  uppy={uppy}
                />
                <Input type="file" />
              </div>

              <div className="mt-44 flex gap-8 max-w-screen-sm w-full mx-auto">
                <Button
                  variant="subtle"
                  className="rounded-md py-2 px-4 text-sm font-medium flex-1"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="black"
                  className="text-white bg-slate-900 py-2 rounded-md px-4 text-sm font-medium flex-1"
                >
                  Далее
                </Button>
              </div>
            </form>
          </div>
        </div>
      </GeneralLayout>
    </>
  );
}
