import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../../api";
import { Button } from "../../primitives/button";
import { TextArea } from "../../primitives/text-area";

interface FormValues {
  education: {
    institution: string;
    title: string;
    description: string;
    startedAt: string;
    finishedAt: string;
  }[];
}

export function EducationCreate({ profileId, isAddHandler }: any) {
  const [error, setError] = useState("");
  const router = useRouter();
  const { itemId } = router.query;
  const parsedId = Number.parseInt(itemId as string, 10) as number;
  const isEdit = !itemId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      education: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "education",
    control,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit === false) {
        await api.educations.update(profileId, parsedId, data.education[0]);
        await router.push({
          pathname: `/app/profiles/${profileId}/education`,
          query: {},
        });
        router.reload();
      } else {
        data.education.forEach(async (post) => {
          const { data } = await api.educations.store(post, profileId);
        });
        if (data) {
          router.reload();
        }
      }
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  useEffect(() => {
    if (Number.isNaN(parsedId)) return;
    async function fetchEducation() {
      await api.educations.show(profileId, parsedId).then(({ data }) => {
        setValue(`education.0.title`, data?.title);
        setValue(`education.0.institution`, data?.institution);
        setValue(`education.0.description`, data?.description);
        setValue(
          `education.0.startedAt`,
          new Date(data.startedAt).toISOString().slice(0, 10)
        );
        setValue(
          `education.0.finishedAt`,
          new Date(data.finishedAt).toISOString().slice(0, 10)
        );
      });
    }
    fetchEducation();
  }, [profileId, setValue, parsedId]);

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
                      placeholder="Специализация"
                      {...register(`education.${index}.title`, {
                        required: "Please enter your first name.",
                      })}
                    />
                    {errors.education?.[index]?.title && (
                      <p className="ml-2 text-sm text-red-500">
                        Обязательное поле
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      className="w-full rounded-md border p-2"
                      placeholder="Учебное завидение"
                      {...register(`education.${index}.institution`, {
                        required: "Please enter your first name.",
                      })}
                    />
                    {errors.education?.[index]?.institution && (
                      <p className="ml-2 text-sm text-red-500">
                        Обязательное поле
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <TextArea
                    className="rounded-md"
                    placeholder="Опишите ваше обучение"
                    {...register(`education.${index}.description`, {
                      required: "Please enter your first name.",
                    })}
                  />
                  {errors.education?.[index]?.description && (
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
                        {...register(`education.${index}.startedAt`, {
                          required: "Please enter your first name.",
                          setValueAs: (value: string | undefined) =>
                            value ? new Date(value).toISOString() : undefined,
                        })}
                      />
                      {errors.education?.[index]?.startedAt && (
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
                        {...register(`education.${index}.finishedAt`, {
                          required: "Please enter your first name.",
                          setValueAs: (value: string | undefined) =>
                            value ? new Date(value).toISOString() : undefined,
                        })}
                      />
                      {errors.education?.[index]?.finishedAt && (
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
                    startedAt: "",
                    finishedAt: "",
                  });
                }}
                variant="outline"
              >
                <Plus /> Добавить образование
              </Button>
            </div>
          )}

          <div className="mt-5 flex justify-end gap-3 pt-4">
            <Button onClick={isAddHandler}>Отмена</Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </div>
    </div>
  );
}