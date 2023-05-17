import clsx from "clsx";
import React from "react";
import { Button } from "../primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../primitives/dialog";

export default function TechBuilder() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="black">Open</Button>
      </DialogTrigger>
      <DialogContent className={clsx("sm:max-w-screen-lg m-10 p-0")}>
        <div className="grid grid-cols-10">
          <div className="col-span-3 bg-slate-900 p-6 rounded-md">
            <p className="text-3xl font-semibold text-white">
              Создание технического задания
            </p>
            <div className="grid gap-11 mt-12">
              <span className="font-semibold text-white">Вид закупки</span>
              <span className="font-semibold text-white">Вид закупки</span>
              <span className="font-semibold text-white">Вид закупки</span>
            </div>
          </div>
          <div className="col-span-7">so</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
