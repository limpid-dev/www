import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { Input } from "../../../../components/primitives/input";
import { Options } from "../../../../components/primitives/options";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../components/primitives/select";
import { TextArea } from "../../../../components/primitives/text-area";

interface FormValues {
  experiences: {
    company: string;
    title: string;
    description: string;
    startedAt: string;
    finishedAt: string;
  }[];
}

export default function Test() {
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

  const onSubmit = async (data: FormValues) => {
    data.experiences.forEach(async (post) => {
      const { data: organization } = await api.organizations
        .experiences(Number.parseInt(router.query.organizationId as string, 10))
        .store(post);
    });

    // if (organization) {
    //   router.push({
    //     pathname: "/app/organizations/create/",
    //     query: { organizationId: organization.id },
    //   });
    // }
  };

  const { fields, append, remove } = useFieldArray({
    name: "experiences",
    control,
  });

  return (
    <>
      <div className="h-auto bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Профиль /</span>
            Создание организации
          </h1>

          <div>
            <div className="mt-12 bg-white border border-slate-200 rounded-lg">
              <div className="flex divide-x overflow-auto gap-4 px-5">
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Общие данные
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-xl">
                  Опыт работы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Доп.материалы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Соцсети
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-12 mx-auto">
                <div className="m-auto border-none sm:w-4/6">
                  <div className="m-auto flex flex-col gap-5">
                    {fields.map((field, index) => {
                      return (
                        <div key={field.id} className="grid gap-5">
                          <div className="flex flex-col sm:flex-row justify-between gap-5">
                            <div className="w-full">
                              <Input
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

                            <div className="w-full">
                              <Input
                                className="w-full rounded-md border p-2"
                                placeholder="Организация"
                                {...register(`experiences.${index}.company`, {
                                  required: "Please enter your first name.",
                                })}
                              />
                              {errors.experiences?.[index]?.company && (
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
                            <div className="flex items-center gap-3 justify-between">
                              <p>Начало</p>
                              <div>
                                <Input
                                  className="rounded-lg border p-1"
                                  placeholder="начало"
                                  type="date"
                                  id="birthday"
                                  {...register(
                                    `experiences.${index}.startedAt`,
                                    {
                                      required: "Please enter your first name.",
                                      setValueAs: (value: string | undefined) =>
                                        value
                                          ? new Date(value).toISOString()
                                          : undefined,
                                    }
                                  )}
                                />
                                {errors.experiences?.[index]?.startedAt && (
                                  <p className="ml-2 text-sm text-red-500">
                                    Выберите дату
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 justify-between">
                              <p>Конец</p>
                              <div>
                                <Input
                                  className="rounded-lg border p-1"
                                  placeholder="начало"
                                  type="date"
                                  id="birthday"
                                  {...register(
                                    `experiences.${index}.finishedAt`,
                                    {
                                      required: "Please enter your first name.",
                                      setValueAs: (value: string | undefined) =>
                                        value
                                          ? new Date(value).toISOString()
                                          : undefined,
                                    }
                                  )}
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
                            company: "",
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
