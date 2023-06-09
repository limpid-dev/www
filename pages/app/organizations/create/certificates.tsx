import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { Input } from "../../../../components/primitives/input";
import { TextArea } from "../../../../components/primitives/text-area";

interface CertificationValues {
  certification: {
    institution: string;
    title: string;
    description: string;
    issued_at: string;
    expired_at: string;
    attachment: FileList;
  }[];
}

export default function Test() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CertificationValues>({});

  const { fields, append, remove } = useFieldArray({
    name: "certification",
    control,
  });

  const onSubmit = async (data: CertificationValues) => {
    try {
      await Promise.all(
        data.certification.map((post) =>
          api.createOrganizationCertificate(
            Number.parseInt(router.query.organizationId as string, 10),
            {
              ...post,
              attachment: post.attachment[0],
            }
          )
        )
      );
      await router.push({
        pathname: "/app/organizations/create/contacts",
        query: { organizationId: router.query.organizationId },
      });
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  return (
    <>
      {" "}
      <Navigation />
      <div className=" min-h-screen bg-slate-50 px-5 pt-8">
        <div className="container mx-auto mb-4 max-w-screen-xl">
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
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Соцсети
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-12 mx-auto ">
                <div className="m-auto border-none sm:w-4/6 ">
                  <div className="m-auto flex flex-col gap-5">
                    {fields.map((field, index) => {
                      return (
                        <div key={field.id} className="flex flex-col gap-5">
                          <div className="flex gap-5 flex-col sm:flex-row">
                            <div className="w-full">
                              <Input
                                placeholder="Название сертификата"
                                {...register(`certification.${index}.title`, {
                                  required: true,
                                })}
                              />
                              {errors.certification?.[index]?.title && (
                                <span className="ml-1 text-sm text-red-600">
                                  Обязательное поле
                                </span>
                              )}
                            </div>
                            <div className="w-full">
                              <Input
                                placeholder="Название организации"
                                {...register(
                                  `certification.${index}.institution`,
                                  {
                                    required: true,
                                  }
                                )}
                              />
                              {errors.certification?.[index]?.title && (
                                <span className="ml-1 text-sm text-red-600">
                                  Обязательное поле
                                </span>
                              )}
                            </div>
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
                                <Input
                                  className="rounded-lg border p-1"
                                  placeholder="начало"
                                  type="date"
                                  id="birthday"
                                  {...register(
                                    `certification.${index}.issued_at`,
                                    {
                                      required: true,
                                    }
                                  )}
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
                                <Input
                                  className="rounded-lg border p-1"
                                  placeholder="начало"
                                  type="date"
                                  id="birthday"
                                  {...register(
                                    `certification.${index}.expired_at`,
                                    {
                                      required: true,
                                    }
                                  )}
                                />
                                {errors.certification?.[index]?.expired_at && (
                                  <p className="ml-2 text-sm text-red-500">
                                    Выберите дату
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <TextArea
                              className="bg-slate-100"
                              placeholder="За что получен сертификат? За какое достижение получена награда?"
                              {...register(
                                `certification.${index}.description`,
                                {
                                  required: true,
                                }
                              )}
                            />
                            {errors.certification?.[index]?.description && (
                              <span className="ml-1 text-sm text-red-600">
                                Обязательное поле
                              </span>
                            )}
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
                            issued_at: "",
                            expired_at: "",
                            attachment: "",
                          });
                        }}
                        variant="outline"
                      >
                        <Plus /> Добавить сертификат
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
                  {error}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
