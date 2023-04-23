import { Plus, Power } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../../api";
import { Entity } from "../../../../api/profilesCertifiations";
import { Navigation } from "../../../../components/Navigation";
import { Button } from "../../../../components/Primitives/Button";
import { General } from "../../../../components/Profiles/General";
import { CertificationCreate } from "../../../../components/Projects/Create/certification";
import SkillsCreate from "../../../../components/Projects/Create/skills";
import Badge from "../../../../images/badge.svg";

const dateFormatter = (arg: string) => {
  return new Date(arg).getFullYear().toString();
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function One() {
  const router = useRouter();
  const { id } = router.query;
  const [certificate, setCertificate] = useState(true);
  const [skill, setSkill] = useState(true);
  const parsedId = Number.parseInt(id as string, 10) as number;
  const [data, setData] = useState<Entity[]>([]);

  const skillAdd = () => {
    setSkill((current: boolean) => !current);
  };

  const certificateAdd = () => {
    setCertificate((current: boolean) => !current);
  };

  const [isAuthor, setIsAuthor] = useState(false);

  const tabs = [
    { name: "Ресурсы", href: `/app/profiles/${id}/`, current: false },
    {
      name: "Образование",
      href: `/app/profiles/${id}/education`,
      current: false,
    },
    {
      name: "Сертификаты",
      href: `/app/profiles/${id}/certification`,
      current: true,
    },
    {
      name: "Проекты",
      href: `/app/profiles/${id}/profileProjects`,
      current: false,
    },
    {
      name: "Опыт работы",
      href: `/app/profiles/${id}/experience`,
      current: false,
    },
  ];

  useEffect(() => {
    async function fetchCertifications() {
      const { data } = await api.certifications.index(parsedId);
      if (data) {
        const updatedItems = data.map((item) => {
          return {
            ...item,
            startedAt: dateFormatter(item.issuedAt),
            finishedAt: dateFormatter(item.expiredAt),
          };
        });
        setData(updatedItems);
      }
    }
    fetchCertifications();
  }, [parsedId]);

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
                <Button className=" bg-slate-700 hover:bg-black">
                  Редактировать
                </Button>
                <Button className=" bg-red-600">Удалить</Button>
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
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-10 ">
            <div className="rounded-lg border sm:col-span-3">
              <General portfolioId={id} />
            </div>

            <div className="rounded-lg border bg-white sm:col-span-7">
              <div className="bg-white">
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full  border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={tabs.find((tab) => tab.current)?.name}
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
                      <Link
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
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="p-6">
                <p className="mb-6 text-xl font-semibold text-slate-400">
                  Сертефикаты
                </p>
                {certificate ? (
                  <>
                    {data.map((certificate, certificateIndex) => (
                      <div key={certificateIndex} className="mb-7">
                        <div className="w-full rounded-xl bg-slate-100 pb-6 pt-4">
                          <div className="flex flex-col items-center justify-center p-3 sm:p-0">
                            <Image
                              src={Badge}
                              alt="Sertificate"
                              className="m-auto"
                            />
                            <p className="text-center text-base font-semibold sm:text-xl">
                              {certificate.title}
                            </p>
                            <p className="text-center text-xs  font-normal sm:text-sm">
                              {certificate.description}
                            </p>
                            <Link href="/">
                              <p className="text-sm font-medium text-sky-500">
                                Смотреть сертификат
                              </p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-7 flex items-center justify-end text-sm text-sky-500 underline">
                      <Plus />
                      <button onClick={certificateAdd}>
                        Добавить сертификат
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <CertificationCreate
                      portfolioId={id}
                      certificateAdd={certificateAdd}
                    />
                  </>
                )}
                <p className="my-7 text-xl font-semibold text-slate-400">
                  Навыки
                </p>
                {skill ? (
                  <>
                    <div className="mt-8 flex">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-6 py-4">
                        <Power />
                        <p> Работа с Битрикс24</p>
                      </div>
                    </div>
                    <div className="mt-7 flex items-center justify-end text-sm text-sky-500 underline">
                      <Plus />
                      <button onClick={skillAdd}>Добавить навык</button>
                    </div>
                  </>
                ) : (
                  <>
                    <SkillsCreate portfolioId={id} skillAdd={skillAdd} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
