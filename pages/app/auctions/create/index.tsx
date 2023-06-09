import Link from "next/link";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import api from "../../../../api";
import { GeneralLayout } from "../../../../components/general-layout";
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
  duration: number;
  industry: string;
  type: string;
  starting_price: number;
  purchase_price: number;
}

export default function Create() {
  const router = useRouter();

  const { register, handleSubmit, control } = useForm<FormValues>({});

  const onSubmit = async (data: FormValues) => {
    const { data: auction } = await api.createAuction({
      title: data.title,
      description: data.description,
      type: data.type,
      industry: data.industry,
      duration: `P${data.duration}D`,
      starting_price: data.starting_price,
      purchase_price: data.purchase_price,
    });
    if (auction.data?.id) {
      router.push({
        pathname: "/app/auctions/create/files",
        query: { auctionId: auction.data.id },
      });
    }
  };

  return (
    <>
      <Navigation />

      <GeneralLayout>
        <h1 className="text-sm">
          <span className="text-slate-300">Аукцион / </span>
          Создание аукциона продаж
        </h1>

        <div className="flex items-baseline justify-between">
          <h1 className="pt-7 text-5xl  font-extrabold">{/* Профиль */}</h1>
        </div>

        <div className="rounded-lg bg-white shadow-sm">
          <div className="flex divide-x overflow-auto gap-4 px-5">
            <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-lg sm:text-xl">
              Общие данные
            </div>
            <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-lg sm:text-xl">
              Документация
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-10 max-w-screen-md mx-auto"
          >
            <div className="pt-5">
              <div className="mb-5 text-lg font-semibold sm:text-2xl">
                Название аукциона
              </div>
              <Input placeholder="Название" {...register("title")} />
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
                Основная информация
              </div>
              <TextArea
                required
                {...register("description")}
                placeholder="Описание аукциона"
                minLength={1}
                maxLength={1024}
              />
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="px-5 text-black rounded-md flex-1 max-w-full text-ellipsis whitespace-nowrap overflow-hidden w-full">
                        <SelectValue placeholder="Признак" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Признак продажи</SelectLabel>
                          <SelectItem value="Товар">Товар</SelectItem>
                          <SelectItem value="Работа">Работа</SelectItem>
                          <SelectItem value="Услуга">Услуга</SelectItem>
                          <SelectItem value="Вакансия">Вакансия</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="industry"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="px-5 text-black rounded-md flex-1 max-w-full text-ellipsis whitespace-nowrap overflow-hidden w-full">
                        <SelectValue placeholder="Сфера деятельности" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="overflow-auto h-[300px]">
                          <SelectLabel>Сфера деятельности</SelectLabel>
                          {Options.map((option) => (
                            <SelectItem key={option.id} value={option.name}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  type="number"
                  required
                  placeholder="Длительность приема заявок (в днях)"
                  {...register("duration")}
                  min={1}
                  max={21}
                />
              </div>
            </div>
            <div className="mb-7">
              <div className=" mb-5 text-lg font-semibold sm:text-2xl">
                Цена
              </div>
              <div className="grid grid-cols-2 gap-7">
                <Input
                  {...register("starting_price", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Стартовая цена"
                />
                <Input
                  {...register("purchase_price", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Цена мнгновенной продажи"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 ">
              <Link href="/app/projects/my">
                <Button variant="subtle">Отмена</Button>
              </Link>
              <Button variant="black" type="submit">
                Далее
              </Button>
            </div>
          </form>
        </div>
      </GeneralLayout>
    </>
  );
}
