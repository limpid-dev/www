import { Question } from "@phosphor-icons/react";
import clsx from "clsx";
import React, { FormEvent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../primitives/dialog";
import { Input } from "../primitives/input";

interface ExperienceFormValues {
  experiences: {
    organization: string;
    title: string;
    description: string;
    startedAt: string;
    finishedAt: string;
  }[];
}

type Steps = readonly unknown[];
type UseStep = ReturnType<typeof useStep>;

function useStep<T extends Steps>(steps: T) {
  const [index, setIndex] = useState(0);

  const step = steps[index] as T[number];

  const goToStep = useCallback(
    (to: T[number]) => {
      setIndex(steps.findIndex((val) => val === to));
    },
    [steps]
  );

  return { step, goToStep };
}

export default function TechBuilder() {
  const [data, setData] = useState<any>({});

  const { step, goToStep } = useStep([
    "type",
    "general",
    "additional",
  ] as const);

  const onSubmit = async (data: any) => {
    console.log(data);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { January: true } });

  return (
    <Dialog>
      <DialogTrigger className="bg-slate-900 text-white hover:bg-slate-700 p-3 active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-slate-100">
        Создать Техническое задание
      </DialogTrigger>
      <DialogContent className={clsx("sm:max-w-screen-lg sm:min-h-[650px]")}>
        {step === "type" && (
          <div className="grid sm:grid-cols-10">
            <div className="sm:col-span-3 bg-slate-900 p-6 sm:rounded-md">
              <p className="text-md sm:text-3xl font-semibold text-white">
                Создание технического задания
              </p>
              <div className="flex gap-5 sm:grid sm:gap-11 mt-5 sm:mt-11">
                <span className="font-semibold text-white">Вид закупки</span>
                <span className="font-semibold text-slate-500">
                  Основная информация
                </span>
                <span className="font-semibold text-slate-500">
                  Дополнительно
                </span>
              </div>
            </div>
            <form
              className="sm:col-span-7 flex flex-col gap-6 p-10 sm:p-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex h-[90%] flex-col justify-center items-center gap-6">
                <div className="flex justify-between items-center border p-4 w-full sm:max-w-[330px]">
                  <div className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      {...register("January")}
                      className="rounded-lg"
                    />
                    <p>Услуга</p>
                  </div>
                  <Question className="w-6 h-6" />
                </div>
                <div className="flex justify-between items-center border p-4 w-full sm:max-w-[330px]">
                  <div className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      {...register("January")}
                      className="rounded-lg"
                    />
                    <p>Работа</p>
                  </div>
                  <Question className="w-6 h-6" />
                </div>
                <div className="flex justify-between items-center border p-4 w-full sm:max-w-[330px]">
                  <div className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      {...register("January")}
                      className="rounded-lg"
                    />
                    <p>Товар</p>
                  </div>
                  <Question className="w-6 h-6" />
                </div>
              </div>
              <div className="flex justify-between px-10 w-full">
                <Button type="reset" variant="subtle">
                  Отмена
                </Button>
                <Button
                  onClick={() => goToStep("general")}
                  type="submit"
                  variant="black"
                >
                  Далее
                </Button>
                {/* <Button onClick={() => goToStep("general")} variant="black">
                  Далее
                </Button> */}
              </div>
            </form>
          </div>
        )}
        {step === "general" && (
          <div className="grid sm:grid-cols-10">
            <div className="sm:col-span-3 bg-slate-900 p-6 sm:rounded-md">
              <p className="text-md sm:text-3xl font-semibold text-white">
                Создание технического задания
              </p>
              <div className="flex gap-5 sm:grid sm:gap-11 mt-5 sm:mt-11">
                <span className="font-semibold text-slate-500">
                  Вид закупки
                </span>
                <span className="font-semibold text-white">
                  Основная информация
                </span>
                <span className="font-semibold text-slate-500">
                  Дополнительно
                </span>
              </div>
            </div>
            <form className="sm:col-span-7 flex flex-col gap-6 p-10 sm:p-10">
              <div className="h-[90%] flex justify-center items-center">
                <div className="grid sm:grid-cols-2 items-center gap-7 w-full">
                  <Input placeholder="Наименование организации" type="text" />
                  <Input placeholder="Место оказания услуги" type="text" />
                  <Input placeholder="БИН/ИНН Заказчика" type="text" />
                  <Input placeholder="Размер авансового платежа" type="text" />
                  <Input
                    placeholder="Наименование закупаемой услуги"
                    type="text"
                  />
                  <Input placeholder="Условия оплаты" type="text" />
                  <Input placeholder="Срок оказания услуги" type="text" />
                  <Input
                    placeholder="Гарантийный срок (в месяцах)"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex justify-between px-10">
                <Button onClick={() => goToStep("type")} variant="subtle">
                  Назад
                </Button>
                <Button onClick={() => goToStep("additional")} variant="black">Далее</Button>
              </div>
            </form>
          </div>
        )}
        {step === "additional" && (
          <div className="grid grid-cols-10">
            <div className="col-span-3 bg-slate-900 p-6 rounded-md">
              <p className="text-md sm:text-3xl font-semibold text-white">
                Создание технического задания
              </p>
              <div className="grid gap-11 mt-11">
                <span className="font-semibold text-white">Вид закупки</span>
                <span className="font-semibold text-slate-500">
                  Основная информация
                </span>
                <span className="font-semibold text-slate-500">
                  Дополнительно
                </span>
              </div>
            </div>
            <div className="col-span-7">
              <div className="flex flex-col justify-center items-center h-[90%] gap-6">
                <div className="flex justify-between items-center border p-4 min-w-[330px]">
                  <div className="flex gap-3 items-center">
                    <input type="checkbox" className=" rounded-lg" />{" "}
                    <p>Услуга</p>{" "}
                  </div>
                  <Question className="w-6 h-6" />
                </div>
                <div className="flex justify-between items-center border p-4 min-w-[330px]">
                  <div className="flex gap-3 items-center">
                    <input type="checkbox" className=" rounded-lg" />{" "}
                    <p>Работа</p>
                  </div>
                  <Question className="w-6 h-6" />
                </div>
                <div className="flex justify-between items-center border p-4 min-w-[330px]">
                  <div className="flex gap-3 items-center">
                    <input type="checkbox" className=" rounded-lg" />{" "}
                    <p>Товар</p>
                  </div>
                  <Question className="w-6 h-6" />
                </div>
              </div>
              <div className="flex justify-between px-10">
                <Button variant="subtle">Отмена</Button>
                <Button variant="black">Далее</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
