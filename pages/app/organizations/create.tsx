import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";
import api from "../../../api";
import { Navigation } from "../../../components/navigation";

export type Steps = readonly unknown[];
export type UseStep = ReturnType<typeof useStep>;

export function useStep<T extends Steps>(steps: T) {
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

export default function OrganizationsCreate() {
  const router = useRouter();
  const [data, setData] = useState<any>({});
  const goBack = () => router.back();

  const { step, goToStep } = useStep(["general", "contacts"] as const);

  const onSubmitGeneral = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    setData((prev: any) => ({ ...prev, general: values }));

    goToStep("contacts");
  };

  const onSubmit = async () => {
    const { general, contacts } = data;

    const { data: organization } = await api.organizations.store(general);

    if (organization) {
      await Promise.all([
        api.organizations.contacts(organization.id).store({
          name: "Instagram",
          value: contacts.instagram,
          type: "URL",
        }),
        api.organizations.contacts(organization.id).store({
          name: "WhatsApp",
          value: contacts.whatsapp,
          type: "URL",
        }),
        api.organizations.contacts(organization.id).store({
          name: "2GIS",
          value: contacts["2gis"],
          type: "URL",
        }),
        api.organizations.contacts(organization.id).store({
          name: "Вебсайт",
          value: contacts.website,
          type: "URL",
        }),
      ]);

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
          </div>
          <div className="mt-8 flex justify-between w-full">
            <div className=" font-extrabold text-5xl leading-none">
              Профиль компании
            </div>
            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="text-slate-900 py-2 px-4 font-medium leading-6 text-sm rounded-md bg-slate-100"
              >
                Отмена
              </button>
              <button
                onClick={onSubmit}
                className="text-white py-2 px-4 font-medium leading-6 text-sm rounded-md bg-lime-500"
              >
                Сохранить
              </button>
            </div>
          </div>
          {step === "general" && (
            <div>
              <div className="mt-12 bg-white border border-slate-200 rounded-lg">
                <div className="flex divide-x">
                  <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-xl">
                    Общие данные
                  </div>
                  <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-slate-300 text-xl">
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
                  onSubmit={onSubmitGeneral}
                  className="p-12 max-w-screen-md mx-auto"
                >
                  <div>
                    <div className="font-semibold text-black text-2xl">
                      Название
                    </div>
                    <input
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
                    <div className="font-semibold text-black text-2xl">
                      Основная информация о вас
                    </div>
                    <div className="flex gap-8">
                      <input
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
                        defaultValue={data.general?.industry}
                        className="py-4 px-5 text-black rounded-md border border-slate-300 mt-6 flex-1 max-w-full text-ellipsis whitespace-nowrap overflow-hidden w-full"
                        required
                      >
                        <option value="" disabled selected>
                          Отрасль
                        </option>
                        {options.map((option) => (
                          <option key={option.id} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-8">
                      <select
                        name="type"
                        defaultValue={data.general?.type}
                        className="py-4 px-5 text-black rounded-md border border-slate-300 mt-6 flex-1"
                        required
                      >
                        <option value="" disabled selected>
                          Тип компании
                        </option>
                        <option value="ИП">ИП</option>
                        <option value="ТОО">ТОО</option>
                        <option value="АО">АО</option>
                        <option value="ООО">ООО</option>
                      </select>
                      <input
                        type="text"
                        name="perfomance"
                        className="py-4 px-5 text-black rounded-md border border-slate-300 mt-6 flex-1"
                        minLength={1}
                        maxLength={255}
                        required
                        placeholder="Производительность"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="font-semibold text-black text-2xl">
                      О компании
                    </div>
                    <textarea
                      defaultValue={data.general?.description}
                      className="w-full rounded-md bg-slate-100 border-none resize-none mt-6 py-4 px-5 text-black"
                      name="description"
                      rows={4}
                      required
                      minLength={1}
                      maxLength={1024}
                      placeholder="Что будущему партнеру стоит знать? Что  будет полезно другим людям?"
                    />
                  </div>
                  <div className="mt-6">
                    <div className="font-semibold text-black text-2xl">
                      Материальный ресурсы
                    </div>
                    <textarea
                      defaultValue={data.general?.ownedMaterialResources}
                      className="w-full rounded-md bg-slate-100 border-none resize-none mt-6 py-4 px-5 text-black"
                      name="ownedMaterialResources"
                      rows={4}
                      required
                      minLength={1}
                      maxLength={1024}
                    />
                  </div>
                  <div className="mt-6">
                    <div className="font-semibold text-black text-2xl">
                      Интеллектуальные ресурсы
                    </div>
                    <textarea
                      defaultValue={data.general?.ownedIntellectualResources}
                      className="w-full rounded-md bg-slate-100 border-none resize-none mt-6 py-4 px-5 text-black"
                      name="ownedIntellectualResources"
                      rows={4}
                      required
                      minLength={1}
                      maxLength={1024}
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
                  <div className="relative mt-2">
                    <Image
                      width={24}
                      height={24}
                      alt=""
                      unoptimized
                      quality={100}
                      src="/2gis.png"
                      className="absolute left-5 inset-y-4"
                    />
                    <input
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
                    <input
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
                    <input
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
                    <input
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
                    onClick={() => goToStep("general")}
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
