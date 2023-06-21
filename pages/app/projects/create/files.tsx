import { Paperclip } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { Input } from "../../../../components/primitives/input";

interface FormValues {
  logo?: FileList;
  video_introduction?: FileList;
  presentation?: FileList;
  business_plan?: FileList;
}

export default function Create() {
  const router = useRouter();
  const { projectId } = router.query;
  const parsedProjectId = Number.parseInt(projectId as string, 10) as number;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({});

  const onSubmit = async (data1: FormValues) => {
    const formData = {
      logo: data1.logo[0],
      video_introduction: data1.video_introduction[0],
      presentation: data1.presentation[0],
      business_plan: data1.business_plan[0],
    };
    try {
      const { data } = await api.updateProject(
        { project_id: parsedProjectId },
        formData
      );
      if (data.data) {
        await router.push(`/app/projects/${parsedProjectId}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const { data } = error.response;
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error: any) => {
            const { field, message } = error;
            switch (field) {
              case "logo":
                setError(field, {
                  type: "manual",
                  message: "Изображение не правильно",
                });
                break;
              case "video_introduction":
                setError(field, {
                  type: "manual",
                  message: "Не правильное видео",
                });
                break;
              case "presentation":
                setError(field, {
                  type: "manual",
                  message: "Презентация не правильна",
                });
                break;
              case "business_plan":
                setError(field, {
                  type: "manual",
                  message: "Не правильный бизнес план",
                });
                break;
              default:
                break;
            }
          });
        }
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50">
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
                  <div className="grid sm:grid-cols-2 gap-10">
                    <div className="grid gap-y-3">
                      <p className="text-2xl font-semibold">Логотип</p>
                      <p className="text-sm">Загрузите логотип проекта</p>
                      <Input type="file" {...register("logo")} />
                      {errors.logo && (
                        <p className="text-red-500">{errors.logo.message}</p>
                      )}
                    </div>
                    <div className="grid gap-y-3">
                      <p className="text-2xl font-semibold">Видео</p>
                      <p className="text-sm">
                        Загрузите короткое видео вашего проекта
                      </p>
                      <Input type="file" {...register("video_introduction")} />
                      {errors.video_introduction && (
                        <p className="text-red-500">
                          {errors.video_introduction.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-y-3">
                      <p className="text-2xl font-semibold">Бизнес план</p>
                      <p className="text-sm">Загрузите ваш бизнесплан</p>
                      <Input type="file" {...register("business_plan")} />
                      {errors.business_plan && (
                        <p className="text-red-500">
                          {errors.business_plan.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-y-3">
                      <p className="text-2xl font-semibold">Презентация</p>
                      <p className="text-sm">Загрузите презентацию проекта</p>
                      <Input type="file" {...register("presentation")} />
                      {errors.presentation && (
                        <p className="text-red-500">
                          {errors.presentation.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-14">
                  <Button variant="outline">Отмена</Button>
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
