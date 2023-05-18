import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  title: string;
  description: string;
  location: string;
  industry: string;
  ownedIntellectualResources: string;
  ownedMaterialResources: string;
}

export default function Test() {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<FormValues>({});

  const onSubmit = async (data: FormValues) => {
    // const { data: organization } = await api.organizations.store(data);
    // if (organization) {
    //   router.push({
    //     pathname: "/app/organizations/create/experiences",
    //     query: { organizationId: organization.id },
    //   });
    // }
  };

  return (
    <>
      <div className="h-auto bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Профиль / </span>
            Создание профиля
          </h1>

          <div>
            <div className="mt-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex divide-x overflow-auto gap-4 px-5">
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-lg sm:text-xl">
                  Общие данные
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-lg sm:text-xl">
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
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Название профиля
                    </div>
                    <Input
                      type="text"
                      {...register("title")}
                      className="py-4 px-5 text-black rounded-md border border-slate-300 mt-6 w-1/2"
                      placeholder="Название"
                      minLength={1}
                      maxLength={255}
                    />
                  </div>

                  <div className="font-semibold text-black text-lg sm:text-2xl">
                    Основная информация
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
                    <Input
                      type="text"
                      //   {...register("bin")}
                      className="py-4 px-5 text-black rounded-md border border-slate-300 flex-1"
                      {...register("location")}
                      placeholder="Локация"
                      required
                    />

                    <Input
                      type="text"
                      //   {...register("bin")}
                      className="py-4 px-5 text-black rounded-md border border-slate-300 flex-1"
                      {...register("industry")}
                      placeholder="Индустрия"
                      required
                    />
                  </div>

                  <div>
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Материальные ресурсы
                    </div>
                    <TextArea
                      className="mt-6"
                      {...register("ownedMaterialResources")}
                      rows={4}
                      required
                      minLength={1}
                      maxLength={1024}
                      placeholder="Что  будет полезно другим людям о материальных ресурсах компании?"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Интеллектуальные ресурсы
                    </div>
                    <TextArea
                      className=" mt-6 "
                      rows={4}
                      {...register("ownedIntellectualResources")}
                      required
                      minLength={1}
                      maxLength={1024}
                      placeholder="Что  будет полезно другим людям о интеллектуальных ресурсах компании?"
                    />
                  </div>
                  <div className="mt-8 flex gap-5">
                    <Button
                      disabled
                      variant="outline"
                      className="rounded-md text-slate-300 py-2 px-4 border border-slate-300 text-sm font-medium flex-1 cursor-not-allowed"
                    >
                      Назад
                    </Button>
                    <Button
                      type="submit"
                      variant="black"
                      className="py-2 px-4 text-sm font-medium flex-1"
                    >
                      Далее
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
