import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { Paperclip } from "@phosphor-icons/react";
import Uppy from "@uppy/core";
import Russian from "@uppy/locales/lib/ru_RU";
import { DashboardModal } from "@uppy/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../api";
import { buildFormData } from "../../../../api/files";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";

const uppy = new Uppy({
  locale: Russian,
  restrictions: {
    allowedFileTypes: [
      ".jpg",
      ".jpeg",
      ".png",
      ".pdf",
      ".docx",
      ".doc",
      ".pptx",
      ".ppt",
      ".xlsx",
      ".xls",
    ],
    maxFileSize: 1024 * 1024 * 8,
  },
});

export default function Test() {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm({});
  const [fileDashboardOpen, setFileDashboardOpen] = useState(false);

  const onSubmit = async () => {
    // const { data: organization } = await api.organizations.store(data);
    // if (organization) {
    //   router.push({
    //     pathname: "/app/organizations/create/experiences",
    //     query: { organizationId: organization.id },
    //   });

    const files = uppy.getFiles().map((file) => {
      const formData = buildFormData(file.data);
      return api.projects
        .files(Number.parseInt(router.query.organizationId as string, 10))
        .store(formData);
    });
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
      <div className=" min-h-screen bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Профиль /</span>
            Создание организации
          </h1>

          <div>
            <div className="mt-12 bg-white border border-slate-200 rounded-lg">
              <div className="flex divide-x overflow-auto gap-4 px-5">
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Общие данные
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Опыт работы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-xl">
                  Доп.материалы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Соцсети
                </div>
              </div>
              <div className="max-w-screen-md mx-auto p-8">
                <div className="font-semibold text-black text-2xl">
                  Доп.материалы
                </div>
                <p className="text-sm text-black mt-3">
                  Загрузите дополнительные материалы, например видео,
                  презентации, статьи, публикации, которые помогут вам привлечь
                  больше клиентов
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="py-8">
                  <div className="grid items-center justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="space-x-2"
                      onClick={() => setFileDashboardOpen(true)}
                    >
                      <Paperclip
                        weight="bold"
                        className="h-4 w-4 text-zinc-800"
                      />
                      <span>Прикрепление файлов</span>
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
                  </div>

                  <div className="mt-44 flex gap-8 max-w-screen-sm w-full mx-auto">
                    <button className="rounded-md text-black py-2 px-4 border border-black text-sm font-medium flex-1">
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="text-white bg-slate-900 py-2 rounded-md px-4 text-sm font-medium flex-1"
                    >
                      Далее
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
