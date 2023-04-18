import { useState } from "react";
import { Navigation } from "../../../components/Navigation";
import { Button } from "../../../components/Primitives/Button";
import { MainInfo } from "./mainInfo";

const tabs = [
  { name: "Опыт работы", href: "./jobExperience", current: false },
  { name: "Образование", href: "./education", current: true },
  { name: "Сертификаты", href: "./certification", current: false },
  { name: "Проекты", href: "#", current: false },
  { name: "Ресурсы", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function One() {
  const [isAuthor, seisAuthor] = useState(true);
  return (
    <div>
      <Navigation />

      <div className=" min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Профиль / </span>
            Консультационные услуги
          </h1>

          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline">
            {isAuthor ? (
              <div className="flex gap-5">
                <Button className="rounded-md bg-slate-700 hover:bg-black">
                  Редактировать
                </Button>
                <Button className=" rounded-md bg-red-600">Удалить</Button>
              </div>
            ) : (
              <div className="flex gap-5">
                <Button className="bg-black hover:bg-slate-600">
                  Написать в чате
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-10 ">
            <div className="rounded-lg border sm:col-span-3">
              <MainInfo />
            </div>

            <div className="rounded-lg border bg-white sm:col-span-7">
              <div className="bg-white">
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={tabs.find((tab) => tab.current).name}
                  >
                    {tabs.map((tab) => (
                      <option key={tab.name}>{tab.name}</option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:block">
                  <nav
                    className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
                    aria-label="Tabs"
                  >
                    {tabs.map((tab, tabIdx) => (
                      <a
                        key={tab.name}
                        href={tab.href}
                        className={classNames(
                          tab.current
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700",
                          tabIdx === 0 ? "rounded-l-lg" : "",
                          tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
                          "group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                      >
                        <span>{tab.name}</span>
                        <span
                          aria-hidden="true"
                          className={classNames(
                            tab.current ? "bg-lime-500" : "bg-transparent",
                            "absolute inset-x-0 bottom-0 h-0.5"
                          )}
                        />
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="p-6">
                <p className=" pb-4 text-xl font-semibold text-slate-400">
                  Высшее образование
                </p>
                <div className="grid grid-cols-10 gap-4">
                  <div className="col-span-4">
                    <div className=" text-lg font-semibold">2022</div>
                  </div>
                  <div className="col-span-6">
                    <p className=" text-lg font-semibold">
                      Казахская Академия Спорта и Туризма
                    </p>
                    <p className=" pb-3 text-sm font-normal"> Алматы</p>
                    <p className=" text-sm font-semibold">
                      Туризм (Магистр туризма)
                    </p>
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
                <p className=" pb-4 text-xl font-semibold text-slate-400">
                  Повышение квалификации
                </p>
                <div className="grid grid-cols-10 gap-4">
                  <div className="col-span-4">
                    <div className=" text-lg font-semibold">2022</div>
                  </div>
                  <div className="col-span-6">
                    <p className=" text-lg font-semibold">
                      Казахская Академия Спорта и Туризма
                    </p>
                    <p className=" pb-3 text-sm font-normal"> Алматы</p>
                    <p className=" text-sm font-semibold">
                      Туризм (Магистр туризма)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
