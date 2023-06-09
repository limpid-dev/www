import { Plus } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../../api";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import { Skeleton } from "../../../components/primitives/skeleton";
import NoProjects from "../../../images/noProjects.svg";
import testAva from "../../../images/projectDefault.svg";

const tabs = [
  { name: "Все проекты", href: "/app/projects/", current: false },
  { name: "Мои проекты", href: "/app/projects/my", current: true },
];

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{
    id: string;
  }>
) => {
  const { data: session } = await api.getUser({
    headers: {
      Cookie: context.req.headers.cookie,
    },
  });

  console.log(session.data.selected_profile_id);
  if (session) {
    const { data: projects } = await api.getProjects(
      {
        page: 1,
        per_page: 6,
        profile_id: session.data.selected_profile_id!,
      },
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );

    return {
      props: {
        data: {
          projects: projects!,
        },
      },
    };
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function All({ data }: Props) {
  const router = useRouter();

  const handleRoute = () => {
    router.push("/app/projects/create");
  };

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };
  return (
    <div>
      <Navigation />
      <div className="h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <p className=" text-sm text-slate-300">Мои проекты</p>
          <div className="my-5 flex flex-col items-end justify-end gap-4 md:mb-12 md:flex-row md:items-center  md:justify-between">
            <div>
              <div className="sm:hidden">
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
                          ? "bg-lime-100 text-lime-700 rounded-md"
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

            <Button
              onClick={handleRoute}
              variant="black"
              className="flex gap-2"
            >
              <Plus className="h-4 w-4" />
              Создать проект
            </Button>
          </div>

          {data.projects.data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {data.projects.data.map((project, projectIndex) => (
                <Link key={projectIndex} href={`/app/projects/${project.id}`}>
                  <div className="grid items-center justify-center gap-4 rounded-lg border py-6 pl-6 pr-4 hover:border-black sm:grid-cols-10">
                    <div className="sm:col-span-4 ">
                      <Image
                        src={testAva}
                        className="m-auto w-[126px] rounded-lg"
                        alt="test"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <div className="flex flex-col gap-1">
                        <h1 className=" text-lg font-semibold">
                          {project.title}
                        </h1>
                        <p className=" text-sm">{project.industry}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-8">
              <Image src={NoProjects} alt="Нет проектов" />
              <p className=" text-2xl font-semibold">У вас нет проектов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
