import { Pen, Plus, Trash } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { EducationCreate } from "../../../../components/profiles/create/education";
import DefaultAva from "../../../../images/avatars/defaultProfile.svg";

const dateFormatter = (arg: string) => {
  return new Date(arg).getFullYear().toString();
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{
    id: string;
  }>
) => {
  const session = await api.session.show({
    headers: {
      Cookie: context.req.headers.cookie!,
    },
    credentials: "include",
  });
  const { data: profile } = await api.profiles.show(Number(context.params!.id));
  const { data: education } = await api.educations.index(
    Number(context.params!.id)
  );

  if (profile && education) {
    const { data: user } = await api.users.show(profile.userId);
    const updatedItems = education.map((item) => {
      return {
        ...item,
        startedAt: dateFormatter(item.startedAt),
        finishedAt: dateFormatter(item.finishedAt),
      };
    });
    const isAuthor =
      session.data?.id && profile.userId && session.data.id === profile.userId;

    return {
      props: {
        data: {
          ...session,
          profile: profile!,
          user: user!,
          isAuthor: isAuthor!,
          education: updatedItems!,
        },
      },
    };
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Education({ data }: Props) {
  const router = useRouter();
  const { id } = router.query;

  const [isAdd, setIsAdd] = useState(true);
  const parsedId = Number.parseInt(id as string, 10) as number;

  const tabs = [
    { name: "Ресурсы", href: `/app/profiles/${id}`, current: false },
    {
      name: "Образование",
      href: `/app/profiles/${id}/education`,
      current: true,
    },
    {
      name: "Сертификаты",
      href: `/app/profiles/${id}/certification`,
      current: false,
    },
    // {
    //   name: "Проекты",
    //   href: `/app/profiles/${id}/projects`,
    //   current: false,
    // },
    {
      name: "Опыт работы",
      href: `/app/profiles/${id}/experience`,
      current: false,
    },
  ];
  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const isAddHandler = () => {
    setIsAdd((current: boolean) => !current);
  };

  const handleDeleteProfile = () => {
    api.profiles.destroy(parsedId);
  };

  const handleDelete = (itemId: any) => {
    api.educations.destroy(parsedId, itemId);
    router.reload();
  };

  return (
    <div>
      <Navigation />

      <div className=" min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline">
            {data.isAuthor ? (
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
              <div className="h-full bg-white px-6">
                <div className="flex flex-col items-center justify-center pt-12">
                  <Image
                    src={data.user.file ? data.user.file.url : DefaultAva}
                    width={0}
                    height={0}
                    unoptimized
                    alt="Profile image"
                    className="mb-3 h-[106px] w-auto rounded-md object-cover"
                  />
                  <p className="text-2xl font-semibold">
                    {data.user.firstName} {data.user.lastName}
                  </p>
                  <p className=" text-sm">{data.profile.industry}</p>
                </div>
                <div className="mb-6 mt-3" />
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-sm text-slate-400">Локация</p>
                    <p className="text-sm ">{data.profile.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Профессия</p>
                    <p className="text-sm">{data.profile.title}</p>
                  </div>
                </div>
                <div className="mb-6 mt-4" />
                <div>
                  <p className="text-lg font-semibold">Обо мне</p>
                  <p className="pt-3 text-sm">{data.profile.description}</p>
                </div>
                <div className="mb-5 mt-3" />
                {/* <div>
        <p className=" mb-4 text-lg font-semibold"> Социальные сети</p>
        <div className="flex gap-6 pb-5">
          <LinkedinLogo />
          <YoutubeLogo />
          <InstagramLogo />
        </div>
      </div> */}
              </div>
            </div>

            <div className="rounded-lg border bg-white sm:col-span-7">
              <div className="bg-white">
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                  <select
                    onChange={handleSelectChange}
                    id="tabs"
                    name="tabs"
                    className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                    defaultValue={`/app/profiles/${id}/education`}
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
                      <Link
                        key={tab.name}
                        href={tab.href}
                        className={clsx(
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
                          className={clsx(
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
                <p className=" pb-4 text-xl font-semibold text-slate-400">
                  Образование
                </p>
                {isAdd ? (
                  <>
                    {data.education.map((item) => (
                      <div key={item.id}>
                        <div className="grid sm:grid-cols-10 grid-cols-1 gap-y-5">
                          <div className="col-span-3 flex gap-5">
                            <div className=" text-lg font-semibold">
                              {item.startedAt}
                            </div>
                            <>-</>
                            <div className=" text-lg font-semibold">
                              {item.finishedAt}
                            </div>
                          </div>
                          <div className="col-span-5">
                            <p className=" text-lg font-semibold">
                              {item.institution}
                            </p>
                            <p className=" text-sm font-semibold">
                              {item.title}
                            </p>
                            <p className=" text-sm flex flex-wrap">
                              {item.description}
                            </p>
                          </div>
                          {data.isAuthor && (
                            <div className="col-span-2">
                              <div className="flex justify-end gap-6">
                                <Button
                                  variant="outline"
                                  color="zinc"
                                  onClick={() => {
                                    setIsAdd(false);
                                    router.push({
                                      pathname: `/app/profiles/${id}/education`,
                                      query: { itemId: item.id },
                                    });
                                  }}
                                >
                                  <Pen className="h-6 w-6" />
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                          )}
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
                    ))}

                    {data.isAuthor && (
                      <div className="flex items-center justify-end text-sm text-sky-500 underline">
                        <Plus />
                        <button
                          onClick={() => {
                            setIsAdd(false);
                            router.push({
                              pathname: `/app/profiles/${id}/education`,
                              query: {},
                            });
                          }}
                        >
                          Добавить образование
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <EducationCreate
                      profileId={parsedId}
                      isAddHandler={isAddHandler}
                    />
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
