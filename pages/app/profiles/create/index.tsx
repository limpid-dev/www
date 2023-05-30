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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const { data: profile } = await api.profiles.store(data);
    if (profile) {
      router.push({
        pathname: "/app/profiles/create/experiences",
        query: { profileId: profile.id },
      });
    }
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
                      id="title"
                      {...register("title", {
                        required: true,
                        minLength: 2,
                        maxLength: 30,
                      })}
                      className="text-black rounded-md border border-slate-300 mt-6 w-1/2"
                      placeholder="Вэб разработчик ..."
                    />
                    {errors.title && (
                      <span className="text-sm text-red-600">
                        Введите вашу професию правильно
                      </span>
                    )}
                  </div>

                  <div className="font-semibold text-black text-lg sm:text-2xl">
                    Основная информация
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
                    <div className="grid w-full">
                      <Input
                        type="text"
                        className="text-black rounded-md border border-slate-300"
                        {...register("location", {
                          required: true,
                        })}
                        placeholder="Населенный пункт"
                      />
                      {errors.location && (
                        <span className="text-sm text-red-600">
                          Введите обязательное поле
                        </span>
                      )}
                    </div>

                    <Controller
                      control={control}
                      name="industry"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <div className="flex flex-col w-full">
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="px-5 text-ellipsis whitespace-nowrap overflow-hidden">
                              <SelectValue placeholder="Выберите отрасль" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="overflow-auto h-[300px]">
                                <SelectLabel>Отрасль</SelectLabel>
                                {Options.map((option) => (
                                  <SelectItem
                                    key={option.id}
                                    value={option.name}
                                  >
                                    {option.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <p>
                            {errors.industry && (
                              <span className="text-sm text-red-600">
                                Введите обязательное поле
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    />
                  </div>
                  <div>
                    <TextArea
                      {...register("description", {
                        required: true,
                      })}
                      placeholder="Кратко опишите себя..."
                    />
                    {errors.description && (
                      <span className="text-sm text-red-600">
                        Введите обязательное поле
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Материальные ресурсы
                    </div>
                    <TextArea
                      className="mt-6"
                      {...register("ownedMaterialResources", {
                        required: true,
                        minLength: 1,
                        maxLength: 1024,
                      })}
                      rows={4}
                      placeholder="Чем вы можете быть полезны ? (помещение, финансы другие материальные ресурсы)"
                    />
                    {errors.ownedMaterialResources &&
                      errors.ownedMaterialResources.type === "required" && (
                        <span className="text-sm text-red-600">
                          Обязательное поле
                        </span>
                      )}
                    {errors.ownedMaterialResources &&
                      errors.ownedMaterialResources.type === "maxLength" && (
                        <span className="text-sm text-red-600">
                          Текст не должен привышать 1024 символа
                        </span>
                      )}
                  </div>
                  <div>
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Интеллектуальные ресурсы
                    </div>
                    <TextArea
                      className=" mt-6 "
                      rows={4}
                      {...register("ownedIntellectualResources", {
                        required: true,
                        minLength: 1,
                        maxLength: 1024,
                      })}
                      placeholder="Какимими навыками вы обладаете ? (Excel, логика, критическое мышление) "
                    />
                    {errors.ownedIntellectualResources &&
                      errors.ownedIntellectualResources.type === "required" && (
                        <span className="text-sm text-red-600">
                          Обязательное поле
                        </span>
                      )}
                    {errors.ownedIntellectualResources &&
                      errors.ownedIntellectualResources.type ===
                        "maxLength" && (
                        <span className="text-sm text-red-600">
                          Текст не должен привышать 1024 символа
                        </span>
                      )}
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
