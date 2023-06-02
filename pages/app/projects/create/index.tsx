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
import { useToast } from "../../../../hooks/useToast";

interface FormValues {
  title: string;
  location: string;
  industry: string;
  stage: string;
  required_money_amount: number;
  owned_money_amount: number;
  description: string;
  required_intellectual_resources: string;
  owned_intellectual_resources: string;
  required_material_resources: string;
  owned_material_resources: string;
  profitability: string;
}

export default function Create() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({});

  const onSubmit = async (post: FormValues) => {
    const { data } = await api.projects.store(post);

    if (data) {
      toast({
        title: "API Call Success",
        description: "The API call was successful!",
      });
      await router.push({
        // pathname: "/app/projects/create/files",
        // query: { projectId: data.id },
      });
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
            <div className="flex divide-x overflow-auto gap-4 px-5">
              <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-lg sm:text-xl">
                Общие данные
              </div>
              <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-lg sm:text-xl">
                Документация
              </div>
            </div>
            <div className="p-10 max-w-screen-md mx-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
                <div className="">
                  <div className="mb-5 text-lg font-semibold sm:text-2xl">
                    Название проекта
                  </div>
                  <Input
                    placeholder="Название"
                    {...register("title", {
                      required: true,
                      minLength: 2,
                      maxLength: 30,
                    })}
                  />
                  {errors.title && (
                    <span className="text-sm text-red-600 ml-2">
                      Введите название проекта
                    </span>
                  )}
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
                    <div>
                      <Input
                        placeholder="Локация"
                        {...register("location", {
                          required: true,
                          minLength: 2,
                          maxLength: 30,
                        })}
                      />
                      {errors.location && (
                        <span className="text-sm text-red-600 ml-2">
                          Введите название проекта
                        </span>
                      )}
                    </div>
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
                    <div>
                      <Input
                        placeholder="Стадия проекта"
                        {...register("stage", {
                          required: true,
                          minLength: 2,
                          maxLength: 30,
                        })}
                      />
                      {errors.stage && (
                        <span className="text-sm text-red-600 ml-2">
                          Введите стадию проекта
                        </span>
                      )}
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
                </div>
                <div className="mb-7">
                  <div className=" mb-5 text-lg font-semibold sm:text-2xl">
                    Финансовые данные
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      type="number"
                      placeholder="Требуемая сумма"
                      {...register("required_money_amount", {
                        setValueAs(value) {
                          return value ? Number(value) : 0;
                        },
                      })}
                      defaultValue={0}
                    />
                    <Input
                      placeholder="Сумма в собственности"
                      {...register("owned_money_amount", {
                        setValueAs(value) {
                          return value ? Number(value) : 0;
                        },
                      })}
                      defaultValue={0}
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
                  <TextArea
                    {...register("description")}
                    className="bg-slate-100"
                    placeholder="Что будущему партнеру стоит знать о проекте? Опишите ваши цели, идеи и т.д."
                  />
                  {errors.description && (
                    <span className="text-sm text-red-600 ml-2">
                      Введите описание проекта
                    </span>
                  )}
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
                        <TextArea
                          className="bg-slate-100"
                          {...register("owned_material_resources", {
                            required: true,
                          })}
                          placeholder="Укажите какие материальные ресурсы у вас уже имеются"
                        />
                        {errors.owned_material_resources && (
                          <span className="text-sm text-red-600 ml-2">
                            Обязательно поле
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="mb-2 text-lg font-semibold">
                          Интеллектуальный ресурс
                        </p>
                        <TextArea
                          className="bg-slate-100"
                          {...register("owned_intellectual_resources", {
                            required: true,
                          })}
                          placeholder="Укажите какие интеллектуальные ресурсы у вас уже имеются"
                        />
                        {errors.owned_intellectual_resources && (
                          <span className="text-sm text-red-600 ml-2">
                            Обязательно поле
                          </span>
                        )}
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
                        <p className="mb-2  text-lg font-semibold">
                          Материальный ресурс
                        </p>
                        <TextArea
                          className="bg-slate-100"
                          placeholder="Укажите какие материальные ресурсы вам нужны"
                          {...register("required_material_resources", {
                            required: true,
                          })}
                        />
                        {errors.required_material_resources && (
                          <span className="text-sm text-red-600 ml-2">
                            Обязательно поле
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="mb-2  text-lg font-semibold">
                          Интеллектуальный ресурс
                        </p>
                        <TextArea
                          className="bg-slate-100"
                          placeholder="Укажите какие интеллектуальные ресурсы вам нужны"
                          {...register("required_intellectual_resources", {
                            required: true,
                          })}
                        />
                        {errors.required_intellectual_resources && (
                          <span className="text-sm text-red-600 ml-2">
                            Обязательно поле
                          </span>
                        )}
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
                </div>
                <div>
                  <p className=" mb-6 text-2xl font-semibold">
                    Ожидаемая рентабельность
                  </p>
                  <TextArea
                    placeholder="Опишите ожидаемую рентабельность"
                    className="bg-slate-100"
                    {...register("profitability", { required: true })}
                  />
                  {errors.profitability && (
                    <span className="text-sm text-red-600 ml-2">
                      Обязательно поле
                    </span>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-4 ">
                  <Link href="/app/projects/my">
                    <Button variant="outline">Отмена</Button>
                  </Link>
                  <Button variant="black" type="submit">
                    Далее
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
