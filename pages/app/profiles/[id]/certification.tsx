import { Plus, Power, Trash } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../../api";
import { Entity as CertificateEntity } from "../../../../api/profilesCertifiations";
import { Entity as SkillsEntity } from "../../../../api/profilesSkills";
import { Navigation } from "../../../../components/Navigation";
import { Button } from "../../../../components/Primitives/Button";
import { CertificationCreate } from "../../../../components/Profiles/Create/certification";
import SkillsCreate from "../../../../components/Profiles/Create/skills";
import { General } from "../../../../components/Profiles/General";
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
    // {
    //   name: "Проекты",
    //   href: `/app/profiles/${id}/profileProjects`,
    //   current: false,
    // },
    {
      name: "Опыт работы",
      href: `/app/profiles/${id}/experience`,
      current: false,
    },
  ];
  const [first, setfirst] = useState(1);
  const [second, setsecond] = useState(1);
  const [certificate, setCertificate] = useState(true);
  const [skill, setSkill] = useState(true);
  const parsedId = Number.parseInt(id as string, 10) as number;
  const [certificateData, setCertificateData] = useState<CertificateEntity[]>(
    []
  );
  const [skillsData, setSkillsData] = useState<SkillsEntity[]>([]);

  const isAuthor = first && second && first === second;

  const skillAdd = () => {
    setSkill((current: boolean) => !current);
  };

  const certificateAdd = () => {
    setCertificate((current: boolean) => !current);
  };

  const handleDeleteProfile = () => {
    api.profiles.destroy(parsedId);
  };

  const handleDeleteSkill = (skillId: number) => {
    api.skills.destroy(id, skillId);

    router.reload();
  };

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await api.profiles.show(parsedId);
      if (data) {
        setsecond(data.userId);
      }
    }
    fetchProfiles();
  }, [parsedId]);

  useEffect(() => {
    async function getSession() {
      const { data } = await api.session.show();
      if (data) {
        setfirst(data.id);
      }
    }
    getSession();
  }, [id]);

  useEffect(() => {
    async function fetchCertifications() {
      const { data } = await api.certifications.index(parsedId);
      const { data: files } = await api.certificateFile.index(parsedId, {
        page: 1,
        perPage: 100,
      });
      if (data) {
        const updatedItems = data.map((item) => {
          return {
            ...item,
            startedAt: dateFormatter(item.issuedAt),
            finishedAt: dateFormatter(item.expiredAt),
          };
        });
        setCertificateData(updatedItems);
      }
    }
    fetchCertifications();
  }, [parsedId]);

  useEffect(() => {
    async function fetchSkills() {
      const { data } = await api.skills.index(parsedId);
      if (data) {
        setSkillsData(data);
      }
    }
    fetchSkills();
  }, [parsedId]);

  return (
    <div>
      <Navigation />

      <div className=" min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline">
            {isAuthor ? (
              <div className="flex gap-5">
                {/* <Button className=" bg-slate-700 hover:bg-black">
                  Редактировать
                </Button> */}
                <Button variant="outline" onClick={() => handleDeleteProfile()}>
                  <Trash className="h-6 w-6" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-5">
                {/* <Button
                  className=" bg-black hover:bg-slate-600"
                  variant="outline"
                  color="white"
                >
                  Написать в чате
                </Button> */}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-10 ">
            <div className="rounded-lg border sm:col-span-3">
              <General profileId={id} />
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
                  Сертификаты
                </p>
                {certificate ? (
                  <>
                    {certificateData.map((certificate, certificateIndex) => (
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
                    {isAuthor && (
                      <div className="mt-7 flex items-center justify-end text-sm text-sky-500 underline">
                        <Plus />
                        <button onClick={certificateAdd}>
                          Добавить сертификат
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <CertificationCreate
                      profileId={id}
                      certificateAdd={certificateAdd}
                    />
                  </>
                )}
                <p className="my-7 text-xl font-semibold text-slate-400">
                  Навыки
                </p>
                {skill ? (
                  <>
                    <div className="mt-8 flex flex-wrap gap-7">
                      {skillsData.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex gap-3">
                          <div className="flex items-center gap-3 rounded-md bg-slate-100 px-4 py-3 text-sm">
                            <Power />
                            <p>{skill.name}</p>
                          </div>
                          {isAuthor && (
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteSkill(skill.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isAuthor && (
                      <div className="mt-7 flex items-center justify-end text-sm text-sky-500 underline">
                        <Plus />
                        <button onClick={skillAdd}>Добавить навык</button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <SkillsCreate profileId={id} skillAdd={skillAdd} />
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
