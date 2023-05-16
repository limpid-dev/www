import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { Input } from "../../../../components/primitives/input";
import { TextArea } from "../../../../components/primitives/text-area";

interface FormValues {
  title: string;
  description: string;
  finishedAt: string;
  startingPrice: number;
  purchasePrice: number;
}

export default function Create() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>({});

  const onSubmit = async (data: FormValues) => {
    console.log(data);
  };

  return (
    <>
      <div className="min-h-screen h-auto bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
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
                  Название проекта
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
                  placeholder="Описание аукциона"
                  minLength={1}
                  maxLength={1024}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Локация" {...register("location")} />
                  <Input placeholder="Стадия проекта" {...register("stage")} />
                  <Input placeholder="Категория" {...register("industry")} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 ">
                <Link href="/app/projects/my">
                  <Button>Отмена</Button>
                </Link>
                <Button type="submit">Далее</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
