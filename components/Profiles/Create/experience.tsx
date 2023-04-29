import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../../api";
import { Button } from "../../Primitives/Button";
import { TextArea } from "../../Primitives/TextArea";

interface FormValues {
  experiences: {
    organization: string;
    title: string;
    description: string;
    startedAt: string;
    finishedAt: string;
  }[];
}

export function ExperienceCreate({ profileId, experienceAdd }: any) {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      experiences: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "experiences",
    control,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      data.experiences.forEach(async (post) => {
        const { data } = await api.experiences.store(post, profileId);
      });
      router.reload();
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  return (
    <div className="m-auto border-none sm:w-4/6">
      <div className="m-auto flex flex-col gap-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="grid gap-5">
                <div className="flex justify-between gap-5 sm:flex-row">
                  <div>
                    <input
                      className="w-full rounded-md border p-2"
                      placeholder="Название"
                      {...register(`experiences.${index}.title`, {
                        required: "Please enter your first name.",
                      })}
                    />
                    {errors.experiences?.[index]?.title && (
                      <p className="ml-2 text-sm text-red-500">
                        Обязательное поле
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      className="w-full rounded-md border p-2"
                      placeholder="Организация"
                      {...register(`experiences.${index}.organization`, {
                        required: "Please enter your first name.",
                      })}
                    />
                    {errors.experiences?.[index]?.organization && (
                      <p className="ml-2 text-sm text-red-500">
                        Обязательное поле
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <TextArea
                    className="rounded-md"
                    placeholder="Описание деятельности"
                    {...register(`experiences.${index}.description`, {
                      required: "Please enter your first name.",
                    })}
                  />
                  {errors.experiences?.[index]?.description && (
                    <p className="ml-2 text-sm text-red-500">
                      Обязательное поле
                    </p>
                  )}
                </div>

                <div className="flex flex-col justify-around gap-5 md:flex-row">
                  <div className="flex items-center justify-between gap-3">
                    <p>Начало</p>
                    <div>
                      <input
                        className="rounded-lg border p-1"
                        placeholder="начало"
                        type="date"
                        id="birthday"
                        {...register(`experiences.${index}.startedAt`, {
                          required: "Please enter your first name.",
                          setValueAs: (value: string | undefined) =>
                            value ? new Date(value).toISOString() : undefined,
                        })}
                      />
                      {errors.experiences?.[index]?.startedAt && (
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
                        {...register(`experiences.${index}.finishedAt`, {
                          required: "Please enter your first name.",
                          setValueAs: (value: string | undefined) =>
                            value ? new Date(value).toISOString() : undefined,
                        })}
                      />
                      {errors.experiences?.[index]?.finishedAt && (
                        <p className="ml-2 text-sm text-red-500">
                          Выберите дату
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative py-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-4 flex flex-col gap-4">
            <Button
              type="button"
              onClick={() => {
                append({
                  organization: "",
                  title: "",
                  description: "",
                  startedAt: "",
                  finishedAt: "",
                });
              }}
              variant="outline"
            >
              <Plus /> Добавить образование
            </Button>
          </div>

          <div className="mt-5 flex justify-end gap-3 pt-4">
            <Button variant="solid" onClick={experienceAdd}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </div>
    </div>
  );
}