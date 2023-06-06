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
// import { buildFormData } from "../../../../api/files";
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

export default function Create() {
  const [error, setError] = useState("");
  const [tab, setTab] = useState("general");
  const router = useRouter();
  const { projectId } = router.query;
  const parsedProjectId = Number.parseInt(projectId as string, 10) as number;

  const [fileDashboardOpen, setFileDashboardOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    uppy.on("dashboard:modal-closed", () => setFileDashboardOpen(false));
  }, []);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    uppy.on("file-added", () => setFileCount(uppy.getFiles().length));
    uppy.on("file-removed", () => setFileCount(uppy.getFiles().length));
  }, []);

  const onSubmit = async () => {
    try {
      const files = uppy.getFiles().map((file) => {
        const formData = buildFormData(file.data);
        return api.projects.files(parsedProjectId).store(formData);
      });

      await router.push({
        pathname: "/app/projects/" + projectId,
      });
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  return (
    <>
      <div className="min-h-screen  bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
          <div className="rounded-lg bg-white shadow-sm">
            <div className="flex divide-x overflow-auto gap-4 px-5">
              <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-lg sm:text-xl">
                Общие данные
              </div>
              <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-lg sm:text-xl">
                Документация
              </div>
            </div>
            <div className="grid min-h-[500px] items-center justify-center border-none p-10 max-w-screen-md mx-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
                <div className="grid items-center justify-center gap-6">
                  <p className="text-lg font-medium">
                    Загрузите бизнес план и медиа файлы косательно проекта
                  </p>
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

                <div className="flex justify-end gap-3 pt-4 ">
                  <Button variant="outline">Отмена</Button>
                  <Button variant="black" type="submit">
                    Сохранить
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
