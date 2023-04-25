import { useRouter } from "next/router";
import { useState } from "react";
import { Navigation } from "../../../../components/Navigation";
import { Button } from "../../../../components/Primitives/Button";
import General from "../../../../components/Projects/General";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function One() {
  const router = useRouter();
  const { id } = router.query;
  const [isAuthor, seisAuthor] = useState(false);
  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };
  const tabs = [
    { name: "О проекте", href: `/app/projects/${id}/`, current: false },
    {
      name: "Ресурсы",
      href: `/app/projects/${id}/resources`,
      current: true,
    },
    {
      name: "Рентабельность",
      href: `/app/projects/${id}/value`,
      current: false,
    },
    // {
    //   name: "Фото и видео",
    //   href: "/app/projects/[id]/media",
    //   current: false,
    // },
  ];

  return (
    <div>
      <Navigation />

      <div className="min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          {/* <h1 className="text-sm">
            <span className="text-slate-300">Профиль / </span>
            Гостиница для животных
          </h1> */}

          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline">
            {/* {isAuthor ? (
              <div className="flex gap-5">
                <Button className=" bg-slate-700 hover:bg-black">
                  Редактировать
                </Button>
                <Button className="  bg-red-600">Удалить</Button>
              </div>
            ) : (
              <div className="flex gap-5">
                <Button
                  className=" bg-black hover:bg-slate-600"
                  variant="outline"
                  color="white"
                >
                  Написать в чате
                </Button>
              </div>
            )} */}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-10 ">
            <div className="rounded-lg border sm:col-span-3">
              <General />
            </div>

            <div className="rounded-lg border bg-white sm:col-span-7">
              <div className="bg-white">
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
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <p className=" text-xl font-semibold text-slate-400">
                      Материальный ресурс
                    </p>
                    <p className="text-sm">
                      Ультрасовременная гостиница для кошек и с собак с
                      раздельным содержанием самцов и самок. В гостинице будут
                      предусмотрены номера Люкс и Стандарт класса. Перед
                      заселением необходимо будет пройти профилактический осмотр
                      ветеринара и предоставить ветеринарный паспорт с
                      поставленными прививками
                    </p>
                  </div>
                  <div />
                  <div className="flex flex-col gap-3">
                    <p className=" text-xl font-semibold text-slate-400">
                      Интеллектуальный ресурс
                    </p>
                    <p className="text-sm">
                      Ультрасовременная гостиница для кошек и с собак с
                      раздельным содержанием самцов и самок. В гостинице будут
                      предусмотрены номера Люкс и Стандарт класса. Перед
                      заселением необходимо будет пройти профилактический осмотр
                      ветеринара и предоставить ветеринарный паспорт с
                      поставленными прививками
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
