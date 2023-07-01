import Link from "next/link";
import { useRouter } from "next/router";
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
  industry: string;
  duration: number;
  purchase_type: string;
  starting_price: number;
  technical_specification: FileList | undefined;
}

export default function Create() {
  const router = useRouter();

  const { register, handleSubmit, control } = useForm<FormValues>({});

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("industry", data.industry);
    if (data.purchase_type !== undefined) {
      formData.append("purchase_type", data.purchase_type);
    }
    formData.append("duration", `P${data.duration}D`);
    formData.append("starting_price", String(data.starting_price));
    if (data.technical_specification[0] !== undefined) {
      formData.append(
        "technical_specification",
        data.technical_specification[0]
      );
    }
    try {
      const response = await api.createTender(formData);
      if (response.data.data?.id) {
        router.push({
          pathname: `/app/tenders/${response.data.data.id}`,
        });
      }
    } catch (error) {
      console.error("Error creating tender:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen h-auto bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Аукцион /</span>
            Создание аукциона закупок
          </h1>

          <div className="flex items-baseline justify-between">
            <h1 className="pt-7 text-5xl  font-extrabold">{/* Профиль */}</h1>
          </div>

          <div className="rounded-lg bg-white shadow-sm">
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
                  placeholder="Описание аукциона закупок"
                  {...register("description")}
                  minLength={1}
                  maxLength={1024}
                />
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <Controller
                    control={control}
                    name="purchase_type"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="px-5 text-black rounded-md flex-1 max-w-full text-ellipsis whitespace-nowrap overflow-hidden w-full">
                          <SelectValue placeholder="Признак" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Признак закупки</SelectLabel>
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                    {...register("duration", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    required
                    placeholder="Длительность приема заявок (в днях)"
                    min={1}
                    max={21}
                  />
                  <Input
                    {...register("starting_price", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="Стартовая цены"
                  />
                </div>
              </div>
              <p className="ml-1 font-medium">Тех задание</p>
              <Input {...register("technical_specification")} type="file" />
              <div className="flex justify-end gap-3 pt-4 ">
                <Link href="/app/tenders">
                  <Button variant="subtle">Отмена</Button>
                </Link>
                <Button variant="black" type="submit">
                  Далее
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
