import { Paperclip, Plus } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import api from "../../../api";
import { buildFormData } from "../../../api/files";
import { Navigation } from "../../navigation";
import { OrganizationCertificationCreate } from "../../../components/organization-certification-create";
import { Button } from "../../../components/primitives/button";
import { Input } from "../../../components/primitives/input";
import { TextArea } from "../../../components/primitives/text-area";

const OrganizationFileCount = dynamic(
  () =>
    import("../../../components/organization-count").then(
      (mod) => mod.OrganizationFileCount
    ),
  { ssr: false }
);

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

const options = [
  { id: 1, name: "Автомобили / Запчасти / Автосервис" },
  { id: 2, name: "Мебель / Материалы / Фурнитура" },
  { id: 4, name: "Хозтовары / Канцелярия / Упаковка" },
  { id: 5, name: "Оборудование / Инструмент" },
  { id: 6, name: "Медицина / Здоровье / Красота" },
  { id: 7, name: "Одежда / Обувь / Галантерея / Парфюмерия" },
  { id: 8, name: "Бытовая техника / Компьютеры / Офисная техника" },
  { id: 9, name: "Продукты питания / Напитки" },
  { id: 10, name: "Продукция производственно-технического назначения" },
  { id: 16, name: "Спорт / Отдых / Туризм" },
  { id: 17, name: "Строительные, отделочные материалы" },
  { id: 18, name: "Металлы / Сырье / Химия" },
  { id: 19, name: "Сельское хозяйство" },
  { id: 20, name: "Ювелирные изделия / Искусство" },
  { id: 21, name: "Электроника / Электротехника" },
  { id: 22, name: "Юридические, финансовые, бизнес-услуги" },
  { id: 23, name: "Транспорт / Грузоперевозки" },
  { id: 24, name: "Торговые комплексы / Спецмагазины" },
  { id: 25, name: "Реклама / Полиграфия / СМИ" },
  { id: 26, name: "Текстиль / Предметы интерьера" },
  { id: 27, name: "Образование / Работа / Карьера" },
  { id: 28, name: "Аварийные, справочные, экстренные службы" },
  { id: 29, name: "Охрана / Безопасность" },
  { id: 30, name: "Строительство / Недвижимость / Ремонт" },
  { id: 31, name: "Товары для животных / Ветеринария" },
  { id: 32, name: "Досуг / Развлечения / Общественное питание" },
  { id: 33, name: "Интернет / Связь / Информационные технологии" },
];

interface ExperienceFormValues {
  experiences: {
    organization: string;
    title: string;
    description: string;
    startedAt: string;
    finishedAt: string;
  }[];
}

export default function OrganizationsCreate() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ExperienceFormValues>({
    defaultValues: {
      experiences: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "experiences",
    control,
  });

  const [data, setData] = useState<any>({});
  const goBack = () => router.back();

  const { step, goToStep } = useStep([
    "general",
    "experiences",
    "certificates",
    "files",
    "contacts",
  ] as const);

  const onSubmitExperiences = async (data: ExperienceFormValues) => {
    setData((prev: any) => ({ ...prev, experiences: data.experiences }));

    goToStep("certificates");
  };

  const onSubmitGeneral = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    setData((prev: any) => ({ ...prev, general: values }));

    goToStep("experiences");
  };

  const onSubmitCertificates = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    setData((prev: any) => ({ ...prev, certificates: values }));

    goToStep("files");
  };

  const onSubmitFiles = async (e: any) => {
    setData((prev: any) => ({ ...prev, files: e.target.files }));
  };

  const onSubmit = async () => {
    const { data: organization } = await api.organizations.store(data.general);

    if (organization) {
      if (data.contacts) {
        await Promise.all([
          data.contacts.instagram &&
            api.organizations.contacts(organization.id).store({
              name: "Instagram",
              value: data.contacts.instagram,
              type: "URL",
            }),
          data.contacts.whatsapp &&
            api.organizations.contacts(organization.id).store({
              name: "WhatsApp",
              value: data.contacts.whatsapp,
              type: "URL",
            }),
          data.contacts["2gis"] &&
            api.organizations.contacts(organization.id).store({
              name: "2GIS",
              value: data.contacts["2gis"],
              type: "URL",
            }),
          data.contacts.website &&
            api.organizations.contacts(organization.id).store({
              name: "Вебсайт",
              value: data.contacts.website,
              type: "URL",
            }),
        ]);
      }

      if (data.files) {
        await Promise.all(
          [...data.files].map(async (file: File) => {
            await api.organizations
              .files(organization.id)
              .store(buildFormData(file));
          })
        );
      }

      await router.push(`/app/organizations/${organization.id}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navigation />
      <div className="mt-8 max-w-screen-xl mx-auto">
        <div>
          <div className="text-sm text-[#1b1c1d]">
            <span className="text-slate-200 ">Профиль /</span> Создание профиля
            организации
          </div>
          <div className="mt-8 flex justify-between w-full">
            <div className=" font-extrabold text-5xl leading-none" />
            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="text-slate-900 py-2 px-4 font-medium leading-6 text-sm rounded-md bg-slate-100"
              >
                Отмена
              </button>
              <button
                onClick={onSubmit}
                disabled={step !== "contacts"}
                className="text-white py-2 px-4 font-medium leading-6 text-sm rounded-md bg-lime-500 disabled:bg-lime-300 disabled:cursor-not-allowed"
              >
                Сохранить
              </button>
            </div>
          </div>
          {step === "general" && (
            <div>
              <div className="mt-12 bg-white border border-slate-200 rounded-lg">
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
                  onSubmit={onSubmitGeneral}
                  className="p-12 max-w-screen-md mx-auto"
                >
                  <div>
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Название профиля компании
                    </div>
                    <Input
                      type="text"
                      name="name"
                      defaultValue={data.general?.name}
                      className="py-4 px-5 text-black rounded-md border border-slate-300 mt-6 w-1/2"
                      placeholder="Название"
                      minLength={1}
                      maxLength={255}
                    />
                  </div>
                  <div className="mt-6">
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Основная информация о вас
                    </div>
                    <div className="flex gap-8">
                      <Input
                        type="text"
                        name="bin"
                        defaultValue={data.general?.bin}
                        className="py-4 px-5 text-black rounded-md border border-slate-300 mt-6 flex-1"
                        minLength={12}
                        maxLength={12}
                        placeholder="БИН/ИИН"
                        pattern="[0-9]{12}"
                        required
                      />
                      <select
                        name="industry"
                        className="px-5 text-black rounded-md border border-slate-300 mt-6 flex-1 max-w-full text-ellipsis whitespace-nowrap overflow-hidden w-full"
                        required
                      >
                        <option value="" disabled selected>
                          Отрасль
                        </option>
                        {options.map((option) => (
                          <option
                            key={option.id}
                            selected={data.general?.industry === option.name}
                            value={option.name}
                          >
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-8">
                      <select
                        name="type"
                        className=" px-5 text-black rounded-md border border-slate-300 mt-6 flex-1"
                        required
                      >
                        <option value="" disabled selected>
                          Тип компании
                        </option>
                        <option
                          selected={data.general?.type === "ИП"}
                          value="ИП"
                        >
                          ИП
                        </option>
                        <option
                          selected={data.general?.type === "ТОО"}
                          value="ТОО"
                        >
                          ТОО
                        </option>
                        <option
                          selected={data.general?.type === "АО"}
                          value="АО"
                        >
                          АО
                        </option>
                        <option
                          selected={data.general?.type === "ООО"}
                          value="ООО"
                        >
                          ООО
                        </option>
                      </select>
                      <Input
                        type="text"
                        name="perfomance"
                        defaultValue={data.general?.perfomance}
                        className="py-4 px-5 text-black rounded-md border border-slate-300 mt-6 flex-1"
                        minLength={1}
                        maxLength={255}
                        required
                        placeholder="Производительность"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      О компании
                    </div>
                    <TextArea
                      defaultValue={data.general?.description}
                      className="mt-6 text-black"
                      name="description"
                      rows={4}
                      required
                      minLength={1}
                      maxLength={1024}
                      placeholder="Что будущему партнеру стоит знать? Что  будет полезно другим людям?"
                    />
                  </div>
                  <div className="mt-6">
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Материальный ресурсы
                    </div>
                    <TextArea
                      defaultValue={data.general?.ownedMaterialResources}
                      className="mt-6"
                      name="ownedMaterialResources"
                      rows={4}
                      required
                      minLength={1}
                      maxLength={1024}
                      placeholder="Что  будет полезно другим людям о материальных ресурсах компании?"
                    />
                  </div>
                  <div className="mt-6">
                    <div className="font-semibold text-black text-lg sm:text-2xl">
                      Интеллектуальные ресурсы
                    </div>
                    <TextArea
                      defaultValue={data.general?.ownedIntellectualResources}
                      className=" mt-6 "
                      name="ownedIntellectualResources"
                      rows={4}
                      required
                      minLength={1}
                      maxLength={1024}
                      placeholder="Что  будет полезно другим людям о интеллектуальных ресурсах компании?"
                    />
                  </div>
                  <div className="mt-8 flex gap-8">
                    <button
                      disabled
                      className="rounded-md text-slate-300 py-2 px-4 border border-slate-300 text-sm font-medium flex-1 cursor-not-allowed"
                    >
                      Назад
                    </button>
                    <button
                      type="submit"
                      className="text-white bg-slate-900 py-2 rounded-md px-4 text-sm font-medium flex-1"
                    >
                      Далее
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {step === "experiences" && (
            <div className="mt-12 bg-white border border-slate-200 rounded-lg">
              <div className="flex divide-x">
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Общие данные
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-xl">
                  Опыт работы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Доп.материалы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Соцсети
                </div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmitExperiences)}
                className="p-12 mx-auto"
              >
                <div className="m-auto border-none sm:w-4/6">
                  <div className="m-auto flex flex-col gap-5">
                    {fields.map((field, index) => {
                      return (
                        <div key={field.id} className="grid gap-5">
                          <div className="flex justify-between gap-5 sm:flex-row">
                            <div>
                              <Input
                                className="w-full rounded-md border p-2"
                                placeholder="Название"
                                {...register(`experiences.${index}.title`, {
                                  required: "Please enter your first name.",
                                })}
                              />
                              {errors.experiences?.[index]?.title && (
                                <p className="ml-2 text-sm text-red-500">
                                  Обязательное поле
                                </p>
                              )}
                            </div>
                            <div>
                              <Input
                                className="w-full rounded-md border p-2"
                                placeholder="Организация"
                                {...register(
                                  `experiences.${index}.organization`,
                                  {
                                    required: "Please enter your first name.",
                                  }
                                )}
                              />
                              {errors.experiences?.[index]?.organization && (
                                <p className="ml-2 text-sm text-red-500">
                                  Обязательное поле
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <TextArea
                              className="rounded-md"
                              placeholder="Описание деятельности"
                              {...register(`experiences.${index}.description`, {
                                required: "Please enter your first name.",
                              })}
                            />
                            {errors.experiences?.[index]?.description && (
                              <p className="ml-2 text-sm text-red-500">
                                Обязательное поле
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col justify-around gap-5 md:flex-row">
                            <div className="flex items-center justify-between gap-3">
                              <p>Начало</p>
                              <div>
                                <Input
                                  className="rounded-lg border p-1"
                                  placeholder="начало"
                                  type="date"
                                  id="birthday"
                                  {...register(
                                    `experiences.${index}.startedAt`,
                                    {
                                      required: "Please enter your first name.",
                                      setValueAs: (value: string | undefined) =>
                                        value
                                          ? new Date(value).toISOString()
                                          : undefined,
                                    }
                                  )}
                                />
                                {errors.experiences?.[index]?.startedAt && (
                                  <p className="ml-2 text-sm text-red-500">
                                    Выберите дату
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <p>Конец</p>
                              <div>
                                <Input
                                  className="rounded-lg border p-1"
                                  placeholder="начало"
                                  type="date"
                                  id="birthday"
                                  {...register(
                                    `experiences.${index}.finishedAt`,
                                    {
                                      required: "Please enter your first name.",
                                      setValueAs: (value: string | undefined) =>
                                        value
                                          ? new Date(value).toISOString()
                                          : undefined,
                                    }
                                  )}
                                />
                                {errors.experiences?.[index]?.finishedAt && (
                                  <p className="ml-2 text-sm text-red-500">
                                    Выберите дату
                                  </p>
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
                        </div>
                      );
                    })}

                    <div className="mt-4 flex flex-col gap-4">
                      <Button
                        type="button"
                        onClick={() => {
                          append({
                            organization: "",
                            title: "",
                            description: "",
                            startedAt: "",
                            finishedAt: "",
                          });
                        }}
                        variant="outline"
                      >
                        <Plus /> Добавить образование
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-44 flex gap-8 max-w-screen-sm w-full mx-auto">
                  <button
                    onClick={() => goToStep("general")}
                    className="rounded-md text-black py-2 px-4 border border-black text-sm font-medium flex-1"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-slate-900 py-2 rounded-md px-4 text-sm font-medium flex-1"
                  >
                    Далее
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "certificates" && (
            <form
              onSubmit={onSubmitCertificates}
              className="mt-12 bg-white border border-slate-200 rounded-lg"
            >
              <div className="flex divide-x">
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Общие данные
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Опыт работы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-xl">
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Доп.материалы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                  Соцсети
                </div>
              </div>
              <OrganizationCertificationCreate />
              <div className="mt-20 flex gap-8 max-w-screen-sm w-full mx-auto mb-8">
                <button
                  onClick={() => goToStep("experiences")}
                  className="rounded-md text-black py-2 px-4 border border-black text-sm font-medium flex-1"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className="text-white bg-slate-900 py-2 rounded-md px-4 text-sm font-medium flex-1"
                >
                  Далее
                </button>
              </div>
            </form>
          )}
          {step === "files" && (
            <>
              <div className="mt-12 bg-white border border-slate-200 rounded-lg">
                <div className="flex divide-x">
                  <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                    Общие данные
                  </div>
                  <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                    Опыт работы
                  </div>
                  <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                    Сертификаты
                  </div>
                  <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-xl">
                    Доп.материалы
                  </div>
                  <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
                    Соцсети
                  </div>
                </div>
                <div className="max-w-screen-md mx-auto mt-8">
                  <div className="font-semibold text-black text-2xl">
                    Доп.материалы
                  </div>
                  <p className="text-sm text-black mt-3">
                    Загрузите дополнительные материалы, например видео,
                    презентации, статьи, публикации, которые помогут вам
                    привлечь больше клиентов
                  </p>
                  <div className="w-full mt-8">
                    <Button
                      onClick={() => {
                        document
                          // eslint-disable-next-line unicorn/prefer-query-selector
                          .getElementById("fffffff")
                          ?.click();
                      }}
                      type="button"
                      variant="outline"
                      className="space-x-2 w-full"
                    >
                      <Paperclip
                        weight="bold"
                        className="h-4 w-4 text-zinc-800"
                      />
                      <span>Прикрепление файлов</span>
                      <span>
                        (Выбрано: <OrganizationFileCount />)
                      </span>
                    </Button>
                    <Input
                      hidden
                      onChange={onSubmitFiles}
                      type="file"
                      name="files"
                      accept=".jpg,.jpeg,.png,.pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls"
                      multiple
                      id="fffffff"
                    />
                  </div>
                </div>
                <div className="mt-20 flex gap-8 max-w-screen-sm w-full mx-auto mb-8">
                  <button
                    onClick={() => goToStep("certificates")}
                    className="rounded-md text-black py-2 px-4 border border-black text-sm font-medium flex-1"
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => {
                      goToStep("contacts");
                    }}
                    className="text-white bg-slate-900 py-2 rounded-md px-4 text-sm font-medium flex-1"
                  >
                    Далее
                  </button>
                </div>
              </div>
            </>
          )}
          {step === "contacts" && (
            <div className="mt-12 bg-white border border-slate-200 rounded-lg">
              <div className="flex divide-x">
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Общие данные
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Опыт работы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Доп.материалы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-xl">
                  Соцсети
                </div>
              </div>
              <form className="p-12 mx-auto">
                <div className="max-w-md mx-auto">
                  <div className="font-semibold text-black text-2xl">
                    Социальные сети
                  </div>
                  <p className="text-sm text-black mt-3 whitespace-nowrap">
                    Укажите ссылки на аккаунты компании в социальных сетях
                  </p>
                  <div className="relative flex justify-center items-center">
                    <Image
                      width={24}
                      height={24}
                      alt=""
                      unoptimized
                      quality={100}
                      src="/2gis.png"
                      className="absolute left-5 inset-y-4"
                    />
                    <Input
                      type="url"
                      name="2gis"
                      onChange={(e) => {
                        setData((prev: any) => ({
                          ...prev,
                          contacts: {
                            ...prev.contacts,
                            "2gis": e.target.value,
                          },
                        }));
                      }}
                      className="py-4 px-5 pl-14 text-black rounded-md border border-slate-300 placeholder:text-black text-sm max-w-sm w-full"
                      placeholder="Ссылка на 2ГИС"
                      minLength={1}
                      maxLength={255}
                    />
                  </div>
                  <div className="relative mt-4">
                    <Image
                      width={24}
                      height={24}
                      alt=""
                      unoptimized
                      quality={100}
                      src="/instagram.png"
                      className="absolute left-5 inset-y-4"
                    />
                    <Input
                      type="url"
                      name="instagram"
                      onChange={(e) => {
                        setData((prev: any) => ({
                          ...prev,
                          contacts: {
                            ...prev.contacts,
                            instagram: e.target.value,
                          },
                        }));
                      }}
                      className="py-4 px-5 pl-14 text-black rounded-md border border-slate-300 placeholder:text-black text-sm max-w-sm w-full"
                      placeholder="Ссылка на Instagram"
                      minLength={1}
                      maxLength={255}
                    />
                  </div>
                  <div className="relative mt-4">
                    <Image
                      width={24}
                      height={24}
                      alt=""
                      unoptimized
                      quality={100}
                      src="/whatsapp.png"
                      className="absolute left-5 inset-y-4"
                    />
                    <Input
                      type="url"
                      name="whatsapp"
                      onChange={(e) => {
                        setData((prev: any) => ({
                          ...prev,
                          contacts: {
                            ...prev.contacts,
                            whatsapp: e.target.value,
                          },
                        }));
                      }}
                      className="py-4 px-5 pl-14 text-black rounded-md border border-slate-300 placeholder:text-black text-sm max-w-sm w-full"
                      placeholder="Ссылка на WhatsApp"
                      minLength={1}
                      maxLength={255}
                    />
                  </div>
                  <div className="relative mt-4">
                    <Image
                      width={24}
                      height={24}
                      alt=""
                      unoptimized
                      quality={100}
                      src="/website.png"
                      className="absolute left-5 inset-y-4"
                    />
                    <Input
                      type="url"
                      name="website"
                      className="py-4 px-5 pl-14 text-black rounded-md border border-slate-300 placeholder:text-black text-sm max-w-sm w-full"
                      placeholder="Ссылка на сайт"
                      minLength={1}
                      maxLength={255}
                    />
                  </div>
                </div>
                <div className="mt-44 flex gap-8 max-w-screen-sm w-full mx-auto">
                  <button
                    onClick={() => goToStep("experiences")}
                    className="rounded-md text-black py-2 px-4 border border-black text-sm font-medium flex-1"
                  >
                    Назад
                  </button>
                  <button
                    disabled
                    className="text-white bg-slate-200 py-2 rounded-md px-4 text-sm font-medium flex-1"
                  >
                    Далее
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
