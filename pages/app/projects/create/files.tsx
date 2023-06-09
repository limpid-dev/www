import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { Paperclip } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";

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

  const onSubmit = async () => {};

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
