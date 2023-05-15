import { Faders, SquaresFour } from "@phosphor-icons/react";
import clsx from "clsx";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";
import api from "../../../api";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/primitives/sheet";
import DefaultAvatar from "../../../images/avatars/defaultProfile.svg";

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

const tabs = [
  { name: "Все профили", href: "/app/profiles/", current: true },
  { name: "Мои профили", href: "/app/profiles/my", current: false },
];

export const getServerSideProps = async () => {
  const { data: profiles } = await api.profiles.index({
    page: 1,
    perPage: 100,
  });

  const withUsers = profiles!.map(async (d) => {
    const user = await api.users.show(d.userId);

    return { ...d, user: user.data! };
  });

  const w = await Promise.all(withUsers);

  return {
    props: {
      data: {
        profilesWithUser: w!,
      },
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Profiles({ data }: Props) {
  const router = useRouter();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <p className="text-sm text-slate-300">Профили</p>
          <div className="my-5 flex flex-col items-center justify-end gap-4 md:mb-12 md:flex-row md:justify-between">
            <div>
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                <select
                  onChange={handleSelectChange}
                  id="tabs"
                  name="tabs"
                  className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                  defaultValue={tabs.find((tab) => tab.current)?.name}
                >
                  {tabs.map((tab) => (
                    <option key={tab.name} value={tab.href}>
                      {tab.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <nav className="flex space-x-4" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      className={clsx(
                        tab.current
                          ? "bg-lime-100 text-lime-700"
                          : "text-gray-500 hover:text-gray-700",
                        " px-3 py-2 text-sm font-medium"
                      )}
                      aria-current={tab.current ? "page" : undefined}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex rounded-md border">
                <input
                  type="search"
                  placeholder="Искать по профилям"
                  className="rounded-lg border-none"
                />
                <Button
                  type="submit"
                  className=" bg-transparent ring-0 ring-transparent hover:bg-slate-100 active:bg-slate-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="black"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </Button>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Faders className="h-6 w-6" />
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <SquaresFour className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent position="right" size="default">
                    <SheetHeader>
                      <SheetTitle>Сфера деятельности</SheetTitle>
                      <SheetDescription>
                        Выберите сферы деятельности интересующие вас
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      {options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-3"
                        >
                          <input type="checkbox" name="" id="" />
                          <p className="text-sm">{option.name}</p>
                        </div>
                      ))}
                    </div>
                    <SheetFooter>
                      <Button type="reset" variant="outline">
                        Сбросить
                      </Button>
                      <Button
                        type="submit"
                        className={clsx(
                          " bg-slate-900 text-white hover:bg-slate-800"
                        )}
                        variant="subtle"
                      >
                        Применить
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {data.profilesWithUser.map((profile) => (
              <Link key={profile.id} href={`/app/profiles/${profile.id}`}>
                <div className="rounded-lg border border-slate-200 bg-white p-4 hover:border-black">
                  <div className="grid grid-cols-10">
                    <div className="col-span-4">
                      <Image
                        src={
                          profile.user.fileId
                            ? profile.user.file.url
                            : DefaultAvatar
                        }
                        width={0}
                        height={0}
                        unoptimized
                        alt="test"
                        className=" h-32 w-32 rounded-lg object-cover"
                      />
                    </div>
                    <div className="col-span-6 flex flex-col gap-1 pl-3">
                      <p>
                        {profile.user.firstName} {profile.user.lastName}
                      </p>

                      <p className="line-clamp-2 w-auto text-xs text-slate-400">
                        {profile.industry}
                      </p>
                      <p className="line-clamp-2 w-auto text-xs text-slate-400">
                        {profile.title}
                      </p>
                      <p className="line-clamp-2 w-auto text-sm text-slate-400">
                        {profile.location}
                      </p>

                      <p className="line-clamp-2 w-auto text-xs">
                        {profile.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
