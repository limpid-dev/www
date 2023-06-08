import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Paperclip, Plus } from "@phosphor-icons/react";
import Uppy from "@uppy/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Russian from "@uppy/locales/lib/ru_RU";
import { Dashboard, DashboardModal } from "@uppy/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../../api";
// import { buildFormData } from "../../../api/files";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { TextArea } from "../../primitives/text-area";

interface CertificationValues {
  certification: {
    institution: string;
    title: string;
    description: string;
    issuedAt: string;
    expiredAt: string;
  }[];
}

const uppy = new Uppy({
  locale: Russian,
  restrictions: {
    maxNumberOfFiles: 1,
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

export function CertificationCreate({ certificateAdd, profileId }: any) {
  const [error, setError] = useState("");
  const [fileDashboardOpen, setFileDashboardOpen] = useState(false);

  useEffect(() => {
    uppy.on("dashboard:modal-closed", () => setFileDashboardOpen(false));
  }, []);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    uppy.on("file-added", () => setFileCount(uppy.getFiles().length));
    uppy.on("file-removed", () => setFileCount(uppy.getFiles().length));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CertificationValues>({
    defaultValues: {
      certification: [
        {
          institution: "",
          title: "",
          description: "",
          issuedAt: "",
          expiredAt: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    name: "certification",
    control,
  });

  const onSubmit = async (data: CertificationValues) => {
    // try {
    //   data.certification.forEach(async (post) => {
    //     const { data } = await api.certifications.store(post, profileId);
    //     if (data) {
    //       const files = uppy.getFiles();
    //       const formData = buildFormData(files[0].data);
    //       const fileId = data.id;
    //       return api.certificateFile.store(formData, profileId, fileId);
    //     }
    //   });
    //   // router.reload();
    // } catch (error) {
    //   setError("Что то пошло не так, попробуйте позже");
    // }
  };

  return (
    <div className=" m-auto border-none sm:w-4/6">
      <div className="m-auto flex  flex-col gap-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex flex-col gap-5">
                <div className="flex gap-5">
                  <Input
                    placeholder="Название сертификата"
                    {...register(`certification.${index}.title`)}
                  />
                  <Input
                    placeholder="Название организации"
                    {...register(`certification.${index}.institution`)}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="space-x-2"
                  onClick={() => setFileDashboardOpen(true)}
                >
                  <Paperclip weight="bold" className="h-4 w-4 text-zinc-800" />
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
                <div className="flex flex-col justify-around gap-5 md:flex-row">
                  <div className="flex items-center justify-between gap-3">
                    <p>Начало</p>
                    <div>
                      <input
                        className="rounded-lg border p-1"
                        placeholder="начало"
                        type="date"
                        id="birthday"
                        {...register(`certification.${index}.issuedAt`, {
                          required: "Please enter your first name.",
                          setValueAs: (value: string | undefined) =>
                            value ? new Date(value).toISOString() : undefined,
                        })}
                      />
                      {errors.certification?.[index]?.issuedAt && (
                        <p className="ml-2 text-sm text-red-500">
                          Выберите дату
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p>Конец</p>
                    <div>
                      <input
                        className="rounded-lg border p-1"
                        placeholder="начало"
                        type="date"
                        id="birthday"
                        {...register(`certification.${index}.expiredAt`, {
                          required: "Please enter your first name.",
                          setValueAs: (value: string | undefined) =>
                            value ? new Date(value).toISOString() : undefined,
                        })}
                      />
                      {errors.certification?.[index]?.expiredAt && (
                        <p className="ml-2 text-sm text-red-500">
                          Выберите дату
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <TextArea
                  className="bg-slate-100"
                  placeholder="За что получен сертификат? За какое достижение получена награда?"
                  {...register(`certification.${index}.description`)}
                />
              </div>
            );
          })}

          <div className="mt-5 flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={certificateAdd}>
              Отмена
            </Button>
            <Button variant="black" type="submit">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
