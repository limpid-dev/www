import { Paperclip, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../api";
import { Navigation } from "../../../components/Navigation";
import { Button } from "../../../components/Primitives/Button";

interface FormValues {
  title: string;
  location: string;
  industry: string;
  stage: string;
  requiredMoneyAmount: number;
  ownedMoneyAmount: number;
  description: string;
  requiredIntellectualResources: string;
  ownedIntellectualResources: string;
  requiredMaterialResources: string;
  ownedMaterialResources: string;
  profitability: string;
}

export default function Create() {
  const [error, setError] = useState("");
  const [tab, setTab] = useState("general");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({});

  const onSubmit = async (post: FormValues) => {
    try {
      const profileId = localStorage.getItem("portfolioId");
      const fullObject = {
        ...post,
        profileId,
      };
      const { data } = await api.projects.store(fullObject);
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
            Создание проекта
          </h1>

          <div className="flex items-baseline justify-between">
            <h1 className="pt-7 text-5xl  font-extrabold	">{/* Профиль */}</h1>
          </div>

          <div className="rounded-lg bg-white shadow-sm">
            <div className="m-auto min-h-[500px] border-none sm:w-7/12">
              <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
                <div className="pt-5">
                  <div className="mb-5 text-lg font-semibold sm:text-2xl">
                    Название проекта
                  </div>
                  <input
                    placeholder="Название"
                    className="rounded-lg border p-1"
                    {...register("title")}
                  />
                </div>
                <div className="relative py-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>
                <div className="mb-7">
                  <div className=" mb-5 text-lg font-semibold sm:text-2xl">
                    Основная информация о проекте
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      className="rounded-lg border p-1"
                      placeholder="Локация"
                      {...register("location")}
                    />
                    <input
                      className="rounded-lg border p-1"
                      placeholder="Стадия проекта"
                      {...register("stage")}
                    />
                    <input
                      placeholder="Категория"
                      className="rounded-lg border p-1"
                      {...register("industry")}
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
                <div className="mb-7">
                  <div className=" mb-5 text-lg font-semibold sm:text-2xl">
                    Финансовые данные
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      placeholder="Требуемая сумма"
                      className="rounded-lg border p-1"
                      {...register("requiredMoneyAmount", {
                        setValueAs(value) {
                          return value ? Number(value) : 0;
                        },
                      })}
                    />
                    <input
                      placeholder="Сумма в собственности"
                      className="rounded-lg border p-1"
                      {...register("ownedMoneyAmount", {
                        setValueAs(value) {
                          return value ? Number(value) : 0;
                        },
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
                <div className="mb-7">
                  <div className=" mb-5 text-lg font-semibold sm:text-2xl ">
                    О проекте
                  </div>
                  <textarea
                    {...register("description")}
                    className="w-full rounded-md bg-slate-100"
                    placeholder="Что будущему партнеру стоит знать о проекте? Опишите ваши цели, идеи и т.д."
                  />
                </div>
                <div className="relative py-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>
                <div className="grid gap-6">
                  <div className="">
                    <p className="mb-5 text-lg font-semibold sm:text-2xl">
                      Ресурсы проекта
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-lg font-semibold">
                          Материальный ресурс
                        </p>
                        <textarea
                          className="w-full rounded-md bg-slate-100"
                          {...register("ownedMaterialResources")}
                          placeholder="Укажите какие материальные ресурсы у вас уже имеются"
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-lg font-semibold">
                          Интеллектуальный ресурс
                        </p>
                        <textarea
                          className="w-full rounded-md bg-slate-100"
                          {...register("ownedIntellectualResources")}
                          placeholder="Укажите какие интеллектуальные ресурсы у вас уже имеются"
                        />
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
                  </div>{" "}
                  <div className="">
                    <p className="mb-5 text-lg font-semibold sm:text-2xl">
                      Требуемые ресурсы проекту
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-6  text-lg font-semibold">
                          Материальный ресурс
                        </p>
                        <textarea
                          className="w-full rounded-md bg-slate-100"
                          placeholder="Укажите какие материальные ресурсы вам нужны"
                          {...register("requiredMaterialResources")}
                        />
                      </div>
                      <div>
                        <p className="mb-6  text-lg font-semibold">
                          Интеллектуальный ресурс
                        </p>
                        <textarea
                          className="w-full rounded-md bg-slate-100"
                          placeholder="Укажите какие интеллектуальные ресурсы вам нужны"
                          {...register("requiredIntellectualResources")}
                        />
                      </div>
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
                </div>{" "}
                <div>
                  <p className=" mb-6 text-2xl font-semibold">
                    Ожидаемая рентабельность
                  </p>
                  <textarea
                    placeholder="Опишите ожидаемую рентабельность"
                    className="w-full rounded-md bg-slate-100"
                    {...register("profitability")}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 ">
                  <Button>Отмена</Button>
                  <Button type="submit">Сохранить</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
