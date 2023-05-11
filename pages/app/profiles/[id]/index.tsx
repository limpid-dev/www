import { Pen, Trash } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../api";
import { Entity } from "../../../../api/profiles";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { TextArea } from "../../../../components/primitives/text-area";
import { General } from "../../../../components/profiles/general";
import DefaultAva from "../../../../images/avatars/defaultProfile.svg";

interface FormValues {
  ownedMaterialResources: string;
  ownedIntellectualResources: string;
}

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

  if (profile) {
    const { data: user } = await api.users.show(profile.userId);
    const isAuthor =
      session.data?.id && profile.userId && session.data.id === profile.userId;

    return {
      props: {
        data: {
          ...session,
          profile: profile!,
          user: user!,
          isAuthor: isAuthor!,
        },
      },
    };
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function OneProfile({ data }: Props) {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };
  const { id } = router.query as {
    id: string;
  };
  const parsedId = Number.parseInt(id as string, 10) as number;

  const handleDeleteProfile = () => {
    api.profiles.destroy(parsedId);
  };

  const tabs = [
    { name: "Ресурсы", href: `/app/profiles/${id}/`, current: true },
    {
      name: "Образование",
      href: `/app/profiles/${id}/education`,
      current: false,
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data1: FormValues) => {
    try {
      const { data } = await api.profiles.update(
        Number.parseInt(id, 10),
        data1
      );
      router.reload();
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  const editMaterialResources = () => {
    setEdit((current: boolean) => !current);
  };

  return (
    <div>
      <Navigation />

      <div className="min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline">
            {data.isAuthor ? (
              <div className="flex gap-5">
                <Button variant="outline" onClick={() => handleDeleteProfile()}>
                  <Trash className="h-6 w-6" />
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-10 ">
            <div className="rounded-lg border sm:col-span-3">
              <div className="h-full bg-white px-6">
                <div className="flex flex-col items-center justify-center pt-12">
                  <Image
                    src={data.user.file.url ? data.user.file.url : DefaultAva}
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
                  <select
                    id="tabs"
                    onChange={handleSelectChange}
                    name="tabs"
                    className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                    defaultValue={`/app/profiles/${id}/`}
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
                {edit ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Материальный ресурс
                        </p>
                        <TextArea
                          placeholder={data.profile.ownedMaterialResources}
                          {...register("ownedMaterialResources")}
                        />
                      </div>

                      <div />
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Интеллектуальный ресурс
                        </p>
                        <TextArea
                          {...register("ownedIntellectualResources")}
                          placeholder={data.profile.ownedIntellectualResources}
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end gap-3 pt-4">
                      <Button onClick={editMaterialResources}>Отмена</Button>
                      <Button type="submit">Сохранить</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-col gap-6 ">
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Материальный ресурс
                        </p>
                        <p className="text-sm">
                          {data.profile.ownedMaterialResources}
                        </p>
                      </div>

                      <div />
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Интеллектуальный ресурс
                        </p>
                        <p className="text-sm">
                          {data.profile.ownedIntellectualResources}
                        </p>
                      </div>
                    </div>
                    {data.isAuthor && (
                      <div className="col-span-2">
                        <div className="flex justify-end gap-6 mt-4">
                          <Button
                            variant="outline"
                            color="zinc"
                            onClick={editMaterialResources}
                          >
                            <Pen className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                    )}
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
