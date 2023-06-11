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
  display_name: string;
  tin: string;
  description: string;
  industry: string;
  legal_structure: string;
  owned_intellectual_resources: string;
  owned_material_resources: string;
  performance: string;
}

export default function Test() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({});

  const onSubmit = async (data: FormValues) => {
    const { data: organization } = await api.createOrganization(data);
    if (organization) {
      router.push({
        pathname: "/app/organizations/create/certificates",
        query: { organizationId: organization.data.id },
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
            Создание организации
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
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-lg sm:text-xl">
                  Доп.материалы
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
                      Название профиля компании
                    </div>
                    <Input
                      type="text"
                      {...register("display_name", { required: true })}
                      className="py-4 px-5 text-black rounded-md border border-slate-300 mt-6 w-1/2"
                      placeholder="Название"
                      minLength={1}
                      maxLength={255}
                    />
                    {errors.display_name && (
                      <span className="ml-1 text-sm text-red-600">
                        Обязательное поле
                      </span>
                    )}
                  </div>

                  <div className="font-semibold text-black text-lg sm:text-2xl">
                    Основная информация
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full">
                      <Input
                        type="text"
                        {...register("tin", { required: true })}
                        className="py-4 px-5 text-black rounded-md border border-slate-300 flex-1"
                        minLength={12}
                        maxLength={12}
                        placeholder="БИН/ИИН"
                        pattern="[0-9]{12}"
                      />
                      {errors.bin && (
                        <span className="ml-1 text-sm text-red-600">
                          Обязательное поле
                        </span>
                      )}
                    </div>
                    <div className="w-full">
                      <Controller
                        control={control}
                        name="industry"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="px-5 text-black rounded-md flex-1 max-w-full text-ellipsis whitespace-nowrap overflow-hidden w-full">
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
                        )}
                      />
                      {errors.industry && (
                        <span className="ml-1 text-sm text-red-600">
                          Обязательное поле
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full">
                      <Controller
                        control={control}
                        name="legal_structure"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="px-5 text-black rounded-md flex-1 max-w-full text-ellipsis whitespace-nowrap overflow-hidden w-full">
                              <SelectValue placeholder="Выберите тип компании" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Выберите тип компании</SelectLabel>
                                <SelectItem value="ИП">ИП</SelectItem>
                                <SelectItem value="ТОО">ТОО</SelectItem>
                                <SelectItem value="АО">АО</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.legal_structure && (
                        <span className="ml-1 text-sm text-red-600">
                          Обязательное поле
                        </span>
                      )}
                    </div>
                    <div className="w-full">
                      <Input
                        type="text"
                        {...register("performance", { required: true })}
                        className="py-4 px-5 text-black rounded-md border border-slate-300 flex-1"
                        minLength={1}
                        maxLength={255}
                        placeholder="Производственная мощность"
                      />
                      {errors.performance && (
                        <span className="ml-1 text-sm text-red-600">
                          Обязательное поле
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      О компании
                    </div>
                    <TextArea
                      className="mt-6 text-black"
                      {...register("description", { required: true })}
                      rows={4}
                      minLength={1}
                      maxLength={1024}
                      placeholder="Что будущему партнеру стоит знать? Что  будет полезно другим людям?"
                    />
                    {errors.description && (
                      <span className="ml-1 text-sm text-red-600">
                        Обязательное поле
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Материальные ресурсы
                    </div>
                    <TextArea
                      className="mt-6"
                      {...register("owned_material_resources", {
                        required: true,
                      })}
                      rows={4}
                      minLength={1}
                      maxLength={1024}
                      placeholder="Что  будет полезно другим людям о материальных ресурсах компании?"
                    />
                    {errors.owned_material_resources && (
                      <span className="ml-1 text-sm text-red-600">
                        Обязательное поле
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
                      {...register("owned_intellectual_resources", {
                        required: true,
                      })}
                      minLength={1}
                      maxLength={1024}
                      placeholder="Что  будет полезно другим людям о интеллектуальных ресурсах компании?"
                    />
                    {errors.owned_intellectual_resources && (
                      <span className="ml-1 text-sm text-red-600">
                        Обязательное поле
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
