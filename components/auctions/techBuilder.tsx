import { Question } from "@phosphor-icons/react";
import clsx from "clsx";
import React from "react";
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

export default function TechBuilder() {
  return (
    <Dialog>
      <DialogTrigger className="bg-slate-900 text-white hover:bg-slate-700 p-3 active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-slate-100">
        Создать Техническое задание
      </DialogTrigger>
      <DialogContent
        className={clsx("sm:max-w-screen-lg min-h-[650px] m-10 p-0")}
      >
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
                  <input type="checkbox" className=" rounded-lg" /> <p>Товар</p>
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
      </DialogContent>
    </Dialog>
  );
}
