import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { Paperclip, Plus } from "@phosphor-icons/react";
import Uppy from "@uppy/core";
import Russian from "@uppy/locales/lib/ru_RU";
import { DashboardModal } from "@uppy/react";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../api";
import { buildFormData } from "../../../api/files";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import { Input } from "../../../components/primitives/input";
import { TextArea } from "../../../components/primitives/text-area";

interface FormValues {
  title: string;
  location: string;
  industry: string;
  stage: string;
  requiredMoneyAmount: number;
  ownedMoneyAmount: number;
  description: string;
  requiredIntellectualResources: string;
  ownedIntellectualResources: string;
  requiredMaterialResources: string;
  ownedMaterialResources: string;
  profitability: string;
}

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
  const [fileDashboardOpen, setFileDashboardOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({});
  useEffect(() => {
    uppy.on("dashboard:modal-closed", () => setFileDashboardOpen(false));
  }, []);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    uppy.on("file-added", () => setFileCount(uppy.getFiles().length));
    uppy.on("file-removed", () => setFileCount(uppy.getFiles().length));
  }, []);

  const onSubmit = async (post: FormValues) => {
    try {
      const files = uppy.getFiles().map((file) => {
        const formData = buildFormData(file.data);
        return api.projects.files(projectId).store(formData);
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
            <div className="m-auto grid min-h-[500px] items-center justify-center border-none sm:w-7/12">
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
                  <Button>Отмена</Button>
                  <Button type="submit">Сохранить</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
