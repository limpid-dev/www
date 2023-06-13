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
  const fileMaxSize = 1 * 1024 * 1024;
  const router = useRouter();
  const { projectId } = router.query;
  const parsedProjectId = Number.parseInt(projectId as string, 10) as number;

  const {
    register,
    setError,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({});

  const onSubmit = async (data1: FormValues) => {
    const { data } = await api.updateProject(
      { project_id: parsedProjectId },
      {
        logo: data1.logo[0],
        video_introduction: data1.video_introduction[0],
        presentation: data1.presentation[0],
        business_plan: data1.business_plan[0],
      }
    );
    if (data.data?.id) {
      await router.push(`/app/projects/${parsedProjectId}`);
    }
  };

  const supportedFileTypes = {
    logo: ["image/jpeg", "image/png"],
    video_introduction: ["video/mp4"],
    business_plan: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    presentation: ["application/pdf", "application/vnd.ms-powerpoint"],
  };

  const handleFileChange = (inputName) => (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileMaxSize = getFileMaxSize(inputName);
      const supportedTypes = supportedFileTypes[inputName];
      if (file.size > fileMaxSize) {
        setError(inputName, {
          type: "validate",
          message: `File size should not exceed ${formatFileSize(fileMaxSize)}`,
        });
      } else if (!supportedTypes.includes(file.type)) {
        // Set error message for file type validation
        setError(inputName, {
          type: "validate",
          message: `Unsupported file type. Please choose ${supportedTypes.join(
            ", "
          )}`,
        });
      } else {
        clearErrors(inputName);
      }
    }
  };

  const getFileMaxSize = (inputName) => {
    switch (inputName) {
      case "logo":
        return 1 * 1024 * 1024;
      case "video_introduction":
        return 128 * 1024 * 1024;
      case "business_plan":
        return 5 * 1024 * 1024;
      case "presentation":
        return 8 * 1024 * 1024;
      default:
        return 0;
    }
  };

  const formatFileSize = (sizeInBytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    if (i === 0) {
      return `${sizeInBytes} ${sizes[i]}`;
    }
    return `${(sizeInBytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
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
                Документа∏ия
              </div>
            </div>
            <div className="grid min-h-[500px] items-center justify-center border-none p-10 max-w-screen-md mx-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
                {/* Rest of your code */}
                <div className="grid items-center justify-center gap-6">
                  <div className="grid sm:grid-cols-2 gap-10">
                    <div className="grid gap-y-3">
                      <p className="text-2xl font-semibold">Логотип</p>
                      <p className="text-sm">Загрузите логотип проекта</p>
                      <Input
                        type="file"
                        {...register("logo")}
                        onChange={handleFileChange("logo")}
                      />
                      {errors.logo && (
                        <span className="text-sm text-red-600">
                          {errors.logo.message}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-y-3">
                      <p className="text-2xl font-semibold">Видео</p>
                      <p className="text-sm">
                        Загрузите короткое видео вашего проекта
                      </p>
                      <Input
                        type="file"
                        {...register("video_introduction")}
                        onChange={handleFileChange("video_introduction")}
                      />
                      {errors.video_introduction && (
                        <span className="text-sm text-red-600">
                          {errors.video_introduction.message}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-y-3">
                      <p className="text-2xl font-semibold">Бизнес план</p>
                      <p className="text-sm">Загрузите ваш бизнесплан</p>
                      <Input
                        type="file"
                        {...register("business_plan")}
                        onChange={handleFileChange("business_plan")}
                      />
                      {errors.business_plan && (
                        <span className="text-sm text-red-600">
                          {errors.business_plan.message}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-y-3">
                      <p className="text-2xl font-semibold">Презентация</p>
                      <p className="text-sm">Загрузите презентацию проекта</p>
                      <Input
                        type="file"
                        {...register("presentation")}
                        onChange={handleFileChange("presentation")}
                      />
                      {errors.presentation && (
                        <span className="text-sm text-red-600">
                          {errors.presentation.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
