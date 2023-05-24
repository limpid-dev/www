import {
  InstagramLogo,
  LinkedinLogo,
  Pen,
  Trash,
  WhatsappLogo,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { Input } from "../../../../components/primitives/input";
import { TextArea } from "../../../../components/primitives/text-area";
import DefaultAva from "../../../../images/avatars/defaultProfile.svg";

interface FormValues {
  ownedMaterialResources: string;
  ownedIntellectualResources: string;
}

interface FormValuesGeneral {
  industry: string;
  location: string;
  description: string;
  title: string;
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
  const { id } = router.query as {
    id: string;
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
    {
      name: "Проекты",
      href: `/app/profiles/${id}/projects`,
      current: false,
    },
    {
      name: "Опыт работы",
      href: `/app/profiles/${id}/experience`,
      current: false,
    },
  ];
  const parsedId = Number.parseInt(id as string, 10) as number;

  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");
  const [editGeneral, setEditGeneral] = useState(false);

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const handleDeleteProfile = async () => {
    api.profiles.destroy(parsedId);

    await router.push({
      pathname: "/app/profiles/my",
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm<FormValuesGeneral>();

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

  const onSubmit2 = async (data1: FormValuesGeneral) => {
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

  const editResources = () => {
    setEdit((current: boolean) => !current);
  };

  const editGeneralInfo = () => {
    setEditGeneral((current: boolean) => !current);
  };

  return (
    <div>
      <Navigation />

      <div className="min-h-[90vh] bg-slate-50 px-5 pt-8">
        <div className="mx-auto max-w-screen-xl">
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
              {editGeneral ? (
                <form onSubmit={handleSubmit2(onSubmit2)}>
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
                      <p className="text-2xl font-semibold mb-2">
                        {data.user.firstName} {data.user.lastName}
                      </p>
                      <p className=" text-sm">
                        <Input
                          {...register2("industry")}
                          placeholder={data.profile.industry}
                        />
                      </p>
                    </div>
                    <div className="mb-6 mt-3" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Локация</p>
                        <p className="text-sm ">
                          <Input
                            {...register2("location")}
                            placeholder={data.profile.location}
                          />
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Профессия</p>
                        <p className="text-sm">
                          <Input
                            {...register2("title")}
                            placeholder={data.profile.title}
                          />
                        </p>
                      </div>
                    </div>
                    <div className="mb-6 mt-4" />
                    <div>
                      <p className="text-lg font-semibold">Обо мне</p>
                      <p className="pt-3 text-sm">
                        <TextArea
                          {...register2("description")}
                          className=" h-"
                          placeholder={data.profile.description}
                        />
                      </p>
                    </div>
                    <div className="mt-5 flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={editGeneralInfo}>
                        Отмена
                      </Button>
                      <Button variant="black" type="submit">
                        Сохранить
                      </Button>
                    </div>
                    <div className="mb-5 mt-3" />
                    <div>
                      <p className=" mb-4 text-lg font-semibold">
                        Социальные сети
                      </p>
                      <div className="flex gap-6 pb-5">
                        <LinkedinLogo />
                        <WhatsappLogo />
                        <InstagramLogo />
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
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
                  {data.isAuthor ? (
                    <div className="col-span-2">
                      <div className="flex justify-end gap-6 mt-4">
                        <Button
                          variant="outline"
                          color="zinc"
                          onClick={editGeneralInfo}
                        >
                          <Pen className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="mb-5 mt-3" />
                  <div>
                    <p className=" mb-4 text-lg font-semibold">
                      Социальные сети
                    </p>
                    <div className="flex gap-6 pb-5">
                      <Image
                        width={24}
                        height={24}
                        alt=""
                        unoptimized
                        quality={100}
                        src="/2gis.png"
                      />
                      <Image
                        width={24}
                        height={24}
                        alt=""
                        unoptimized
                        quality={100}
                        src="/instagram.png"
                      />
                      <Image
                        width={24}
                        height={24}
                        alt=""
                        unoptimized
                        quality={100}
                        src="/whatsapp.png"
                      />
                      <Image
                        width={24}
                        height={24}
                        alt=""
                        unoptimized
                        quality={100}
                        src="/website.png"
                      />
                    </div>
                  </div>
                </div>
              )}
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
                      <Button onClick={editResources}>Отмена</Button>
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
                            onClick={editResources}
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
