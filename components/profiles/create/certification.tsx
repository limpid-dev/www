import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../../api";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { TextArea } from "../../primitives/text-area";

interface CertificationValues {
  certification: {
    institution: string;
    title: string;
    description: string;
    issued_at: string;
    expired_at: string;
    attachment: File;
  }[];
}

export function CertificationCreate({ certificateAdd, profileId }: any) {
  const [error, setError] = useState("");
  const [fileDashboardOpen, setFileDashboardOpen] = useState(false);
  const router = useRouter();

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
          issued_at: "",
          expired_at: "",
          attachment: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    name: "certification",
    control,
  });

  const onSubmit = async (data: CertificationValues) => {
    try {
      data.certification.forEach(async (data) => {
        const { data: certificate } = await api.createCertificate(profileId, {
          ...data,
          attachment: data.attachment[0],
        });
      });
      router.reload();
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
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

                <Input
                  id="fileInput"
                  type="file"
                  {...register(`certification.${index}.attachment`, {
                    required: true,
                  })}
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
                        {...register(`certification.${index}.issued_at`, {
                          required: "Please enter your first name.",
                        })}
                      />
                      {errors.certification?.[index]?.issued_at && (
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
                        {...register(`certification.${index}.expired_at`, {
                          required: "Please enter your first name.",
                        })}
                      />
                      {errors.certification?.[index]?.expired_at && (
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
