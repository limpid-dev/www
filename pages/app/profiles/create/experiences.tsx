import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { Input } from "../../../../components/primitives/input";
import { TextArea } from "../../../../components/primitives/text-area";

interface FormValues {
  experiences: {
    institution: string;
    title: string;
    description: string;
    started_at: string;
    finished_at: string;
  }[];
}

export default function Test() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({});

  const onSubmit = async (data: FormValues) => {
    data.experiences.forEach(async (post) => {
      await api.createExperience(
        Number.parseInt(router.query.profileId as string, 10),
        post
      );
    });

    router.push({
      pathname: "/app/profiles/create/educations",
      query: { profileId: router.query.profileId },
    });
  };

  const { fields, append, remove } = useFieldArray({
    name: "experiences",
    control,
  });

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Профиль / </span>
            Создание профиля
          </h1>

          <div>
            <div className="mt-12 bg-white border border-slate-200 rounded-lg">
              <div className="flex divide-x overflow-auto gap-4 px-5">
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-lg sm:text-xl">
                  Общие данные
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-lg sm:text-xl">
                  Опыт работы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-lg sm:text-xl">
                  Образование
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-lg sm:text-xl">
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-lg sm:text-xl">
                  Соцсети
                </div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-10 max-w-screen-md mx-auto"
              >
                <div className="m-auto flex flex-col gap-5">
                  {fields.map((field, index) => {
                    return (
                      <div key={field.id} className="grid gap-5">
                        <div className="flex flex-col sm:flex-row gap-5">
                          <div className="w-full ">
                            <Input
                              placeholder="Должность"
                              {...register(`experiences.${index}.title`, {
                                required: true,
                              })}
                            />
                            {errors.experiences?.[index]?.title && (
                              <p className="ml-2 text-sm text-red-500">
                                Обязательное поле
                              </p>
                            )}
                          </div>
                          <div className="w-full ">
                            <Input
                              placeholder="Организация"
                              {...register(`experiences.${index}.institution`, {
                                required: true,
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
                            placeholder="Расскажите какие у вас были обязанности, какие задачи вы выполняли во время работы в компании?"
                            {...register(`experiences.${index}.description`, {
                              required: true,
                            })}
                          />
                          {errors.experiences?.[index]?.description && (
                            <p className="ml-2 text-sm text-red-500">
                              Обязательное поле
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row justify-around">
                          <div className="flex items-center justify-between gap-3">
                            <p>Начало</p>
                            <div>
                              <Input
                                className="rounded-lg border p-1"
                                placeholder="начало"
                                type="date"
                                id="birthday"
                                {...register(
                                  `experiences.${index}.started_at`,
                                  {
                                    required: true,
                                  }
                                )}
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
                              <Input
                                className="rounded-lg border p-1"
                                placeholder="начало"
                                type="date"
                                id="birthday"
                                {...register(
                                  `experiences.${index}.finished_at`,
                                  {
                                    required: true,
                                  }
                                )}
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

                  <div className="mt-4 flex flex-col gap-4">
                    <Button
                      type="button"
                      className="flex gap-3"
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
                    >
                      <Plus className="w-5 h-5" /> Добавить опыт работы
                    </Button>
                  </div>
                </div>

                <div className="mt-32 flex gap-8 max-w-screen-sm w-full mx-auto">
                  <button
                    onClick={() => remove()}
                    className="rounded-md text-black py-2 px-4 border border-black text-sm font-medium flex-1"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-slate-900 py-2 rounded-md px-4 text-sm font-medium flex-1"
                  >
                    Далее
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
