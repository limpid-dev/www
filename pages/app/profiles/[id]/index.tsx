import { useState } from "react";
import { Navigation } from "../../../../components/Navigation";
import { Button } from "../../../../components/Primitives/Button";
import { MainInfo } from "../../../../components/Profiles/General";

const tabs = [
  { name: "Опыт работы", href: "/app/profiles/[id]/", current: true },
  {
    name: "Образование",
    href: "/app/profiles/[id]/education",
    current: false,
  },
  {
    name: "Сертификаты",
    href: "/app/profiles/[id]/certification",
    current: false,
  },
  {
    name: "Проекты",
    href: "/app/profiles/[id]/profileProjects",
    current: false,
  },
  { name: "Ресурсы", href: "/app/profiles/[id]/resources", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function One() {
  const [isAuthor, seisAuthor] = useState(false);
  return (
    <div>
      <Navigation />

      <div className="min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Профиль / </span>
            Консультационные услуги
          </h1>

          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline">
            {isAuthor ? (
              <div className="flex gap-5">
                <Button className="bg-slate-700 hover:bg-black">
                  Редактировать
                </Button>
                <Button>Удалить</Button>
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
                <div className="mb-6 grid gap-8 sm:grid-cols-10">
                  <div className="sm:col-span-2">
                    <div className="flex flex-col gap-1.5">
                      <p className=" text-lg font-semibold">
                        Апрель, 2022 - по настоящее время
                      </p>
                      <p className="text-sm text-slate-400">11 месяцев</p>
                    </div>
                  </div>
                  <div className="sm:col-span-8">
                    <div>
                      <p className=" text-lg font-semibold">ht.kz</p>
                      <p className=" mb-3 text-sm font-normal">Astana</p>
                      <p className=" mb-2 text-sm font-semibold">
                        Менеджер по туризму
                      </p>
                      <p className="text-sm font-normal">
                        Консультирование клиентов и продажа туристических услуг.
                        Выполнение плана продаж. Ведение отчетности по
                        выполненной работе. Бронирование
                        авиабилетов/туристических пакетов/оформление
                        виз/холодные звонки с клиентами/ведение базы туристов.
                        Переговоры с потенциальными партнёрами
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
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
