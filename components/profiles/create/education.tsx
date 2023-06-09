import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import api from "../../../api";
import { Button } from "../../primitives/button";
import { TextArea } from "../../primitives/text-area";

interface FormValues {
  education: {
    institution: string;
    title: string;
    description: string;
    started_at: string;
    finished_at: string;
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
        await api.updateEducation(
          { profile_id: profileId, education_id: parsedId },
          data.education[0]
        );
        await router.push({
          pathname: `/app/profiles/${profileId}/educations`,
          query: {},
        });
        isAddHandler(false);
      } else {
        await Promise.all(
          data.education.map(async (post) => {
            const { data } = await api.createEducation(profileId, post);
            return data;
          })
        );

        await router.reload();
      }
    } catch (error) {
      setError("Что-то пошло не так, попробуйте позже");
    }
  };

  useEffect(() => {
    if (Number.isNaN(parsedId)) return;

    async function fetchEducation() {
      const response = await api.getEducation({
        profile_id: profileId,
        education_id: parsedId,
      });

      if (response.data.data !== null && response.data.data.description) {
        setValue(`education.0.title`, response.data.data.title);
        setValue(`education.0.institution`, response.data.data.institution);
        setValue(`education.0.description`, response.data.data.description);
        setValue(
          `education.0.started_at`,
          new Date(response.data.data.started_at).toISOString().slice(0, 10)
        );
        setValue(
          `education.0.finished_at`,
          new Date(response.data.data.finished_at).toISOString().slice(0, 10)
        );
      }
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
                  <TextareaAutosize
                    minRows={4}
                    className="rounded-md w-full h-auto resize-none text-sm"
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
                        {...register(`education.${index}.started_at`, {
                          required: "Please enter your first name.",
                        })}
                      />
                      {errors.education?.[index]?.started_at && (
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
                        {...register(`education.${index}.finished_at`, {
                          required: "Please enter your first name.",
                        })}
                      />
                      {errors.education?.[index]?.finished_at && (
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
                  pathname: `/app/profiles/${profileId}/educations`,
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
