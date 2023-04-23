import { Plus } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../api";
import { Button } from "../Primitives/Button";

interface FormValues {
  education: {
    institution: string;
    title: string;
    description: string;
    startedAt: string;
    finishedAt: string;
  }[];
}

export function EducationCreate({ portfolioId, isAddHandler }: any) {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
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
      data.education.forEach(async (post) => {
        const { data } = await api.educations.store(post, portfolioId);
      });

      if (data) {
        // todo router push
        window.location.href = `education`;
      }
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  return (
    <div className="m-auto min-h-[500px] border-none  sm:w-3/4">
      <div className="m-auto flex flex-col gap-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="grid gap-5">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <input
                    className="rounded-md border p-2"
                    placeholder="Специализация"
                    {...register(`education.${index}.title`)}
                  />
                  <input
                    className="rounded-md border p-2"
                    placeholder="Учебное завидение"
                    {...register(`education.${index}.institution`)}
                  />
                </div>

                <textarea
                  className="rounded-md"
                  placeholder="Опишите ваше обучение"
                  {...register(`education.${index}.description`)}
                />

                <div className="flex w-fit flex-col justify-center gap-5 md:flex-row">
                  <div className="flex items-center justify-between gap-3">
                    <p>Начало</p>
                    <input
                      className="rounded-lg border p-1"
                      placeholder="начало"
                      type="date"
                      id="birthday"
                      {...register(`education.${index}.startedAt`, {
                        setValueAs: (value: string | undefined) =>
                          value ? new Date(value).toISOString() : undefined,
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p>Конец</p>
                    <input
                      className="rounded-lg border p-1"
                      placeholder="начало"
                      type="date"
                      id="birthday"
                      {...register(`education.${index}.finishedAt`, {
                        setValueAs: (value: string | undefined) =>
                          value ? new Date(value).toISOString() : undefined,
                      })}
                    />
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
                  institution: "",
                  title: "",
                  description: "",
                  startedAt: "",
                  finishedAt: "",
                });
              }}
              variant="outline"
            >
              <Plus /> Добавить место работы
            </Button>
          </div>

          <div className="mt-5 flex justify-end gap-3 pt-4">
            <Button variant="solid" onClick={isAddHandler}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
