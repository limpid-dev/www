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
    issuedAt: string;
    expiredAt: string;
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

  const { fields, append, remove } = useFieldArray({
    name: "certification",
    control,
  });

  const onSubmitFile = async (fileId: number) => {
    const inputFile = document.querySelector("#fileInput") as HTMLInputElement;
    const formData = new FormData();

    const files = inputFile.files ? Array.from(inputFile.files) : [];
    for (const f of files) {
      formData.set("file", f);
    }

    const { data } = await api.certificateFile.store(
      formData,
      Number.parseInt(router.query.organizationId as string, 10),
      fileId
    );

    console.log(data);
  };

  const onSubmit = async (data: CertificationValues) => {
    try {
      data.certification.forEach(async (post) => {
        const { data } = await api.certifications.store(
          post,
          Number.parseInt(router.query.organizationId as string, 10)
        );
        if (data) {
          onSubmitFile(data.profileId);
        } else {
          throw new Error("Network response was not ok.");
        }
      });
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

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
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Опыт работы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-xl">
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Доп.материалы
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
                            <Input
                              placeholder="Название сертификата"
                              {...register(`certification.${index}.title`)}
                            />
                            <Input
                              placeholder="Название организации"
                              {...register(
                                `certification.${index}.institution`
                              )}
                            />
                          </div>

                          <Input id="fileInput" type="file" />
                          <div className="flex flex-col  gap-5 md:flex-row">
                            <div className="flex items-center justify-between gap-3">
                              <p>Начало</p>
                              <div>
                                <Input
                                  className="rounded-lg border p-1"
                                  placeholder="начало"
                                  type="date"
                                  id="birthday"
                                  {...register(
                                    `certification.${index}.issuedAt`,
                                    {
                                      required: "Please enter your first name.",
                                      setValueAs: (value: string | undefined) =>
                                        value
                                          ? new Date(value).toISOString()
                                          : undefined,
                                    }
                                  )}
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
                                <Input
                                  className="rounded-lg border p-1"
                                  placeholder="начало"
                                  type="date"
                                  id="birthday"
                                  {...register(
                                    `certification.${index}.expiredAt`,
                                    {
                                      required: "Please enter your first name.",
                                      setValueAs: (value: string | undefined) =>
                                        value
                                          ? new Date(value).toISOString()
                                          : undefined,
                                    }
                                  )}
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
                            issuedAt: "",
                            expiredAt: "",
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
