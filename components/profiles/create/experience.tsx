import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../../api";
import { Button } from "../../primitives/button";
import { TextArea } from "../../primitives/text-area";

interface FormValues {
  experiences: {
    title: string;
    institution: string;
    description: string;
    started_at: string;
    finished_at: string;
  }[];
}

export function ExperienceCreate({ profileId, isAddHandler }: any) {
  console.log(profileId, isAddHandler);
  const [error, setError] = useState("");
  const router = useRouter();
  const { itemId } = router.query;
  const parsedId = Number.parseInt(itemId as string, 10) as number;
  const isEdit = !itemId;

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      experiences: [{}],
    },
  });

  const { fields, append } = useFieldArray({
    name: "experiences",
    control,
  });

  useEffect(() => {
    if (Number.isNaN(parsedId)) return;

    async function fetchEducation() {
      const { data } = await api.getExperience({
        profile_id: profileId,
        experience_id: parsedId,
      });
      if (data.data) {
        setValue(`experiences.0.title`, data.data.title);
        setValue(`experiences.0.institution`, data.data.institution);
        setValue(`experiences.0.description`, data.data.description);
        setValue(`experiences.0.started_at`, new Date(data.data.started_at));
        setValue(`experiences.0.finished_at`, new Date(data.data.finished_at));
      }
    }
    fetchEducation();
  }, [profileId, setValue, parsedId]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit === false) {
        await api.updateExperience(
          { profile_id: profileId, experience_id: parsedId },
          data.experiences[0]
        );
        await router.push({
          pathname: `/app/profiles/${profileId}/experiences`,
          query: {},
        });
        router.reload();
      } else {
        data.experiences.map(async (post) => {
          const { data } = await api.createExperience(profileId, post);
          return data;
        });
        if (data) {
          router.reload();
        }
      }
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
                      placeholder="Место работы"
                      {...register(`experiences.${index}.institution`, {
                        required: "Please enter your first name.",
                      })}
                    />
                    {errors.experiences?.[index]?.institution && (
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
                        {...register(`experiences.${index}.started_at`, {
                          required: "Please enter your first name.",
                        })}
                      />
                      {errors.experiences?.[index]?.started_at && (
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
                        {...register(`experiences.${index}.finished_at`, {
                          required: "Please enter your first name.",
                        })}
                      />
                      {errors.experiences?.[index]?.finished_at && (
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

          {isEdit && (
            <div className="mt-4 flex flex-col gap-4">
              <Button
                type="button"
                onClick={() => {
                  append({
                    institution: "",
                    title: "",
                    description: "",
                    started_at: "",
                    finished_at: "",
                  });
                }}
                variant="outline"
                className="flex gap-3"
              >
                <Plus className="h-4 w-4" />
                Добавить образование
              </Button>
            </div>
          )}

          <div className="mt-5 flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                isAddHandler();
                router.push({
                  pathname: `/app/profiles/${profileId}/experiences`,
                  query: {},
                });
              }}
            >
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
