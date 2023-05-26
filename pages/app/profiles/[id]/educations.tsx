import { Pen, Plus, Trash } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/primitives/alert-dialog";
import { Button } from "../../../../components/primitives/button";
import { Input } from "../../../../components/primitives/input";
import { TextArea } from "../../../../components/primitives/text-area";
import { EducationCreate } from "../../../../components/profiles/create/education";
import DefaultAva from "../../../../images/avatars/defaultProfile.svg";

const dateFormatter = (arg: string) => {
  return new Date(arg).getFullYear().toString();
};
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
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm<FormValuesGeneral>();
  const [error, setError] = useState("");

  const [editGeneral, setEditGeneral] = useState(false);
  const editGeneralInfo = () => {
    setEditGeneral((current: boolean) => !current);
  };
  const onSubmit2 = async (data1: FormValuesGeneral) => {
    try {
      const { data } = await api.profiles.update(parsedId, data1);
      router.reload();
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };
  const [isAdd, setIsAdd] = useState(true);
  const parsedId = Number.parseInt(id as string, 10) as number;

  const tabs = [
    { name: "Ресурсы", href: `/app/profiles/${id}`, current: false },
    {
      name: "Образование",
      href: `/app/profiles/${id}/educations`,
      current: true,
    },
    {
      name: "Сертификаты",
      href: `/app/profiles/${id}/certifications`,
      current: false,
    },
    {
      name: "Проекты",
      href: `/app/profiles/${id}/projects`,
      current: false,
    },
    {
      name: "Опыт работы",
      href: `/app/profiles/${id}/experiences`,
      current: false,
    },
  ];

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const [contacts, setContacts] = useState({});

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

      <div className=" min-h-[90vh] bg-slate-50 px-5 pt-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline">
            {data.isAuthor ? (
              <div className="flex gap-5">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <Trash className="h-6 w-6" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить профиль?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Восстановить профиль будет невозможно
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteProfile()}>
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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

                    <div className="mb-5 mt-3" />
                    <div>
                      <p className="text-lg font-semibold">Социальные сети</p>
                      <div className="flex flex-col gap-2 pb-5">
                        <div className="relative mt-4 flex items-center">
                          <Image
                            width={24}
                            height={24}
                            alt=""
                            unoptimized
                            quality={100}
                            src="/2gis.png"
                            className="absolute left-5"
                          />
                          <Input
                            type="url"
                            name="2gis"
                            onChange={(e) => {
                              setContacts((prev: any) => ({
                                ...prev.contacts,
                                "2gis": e.target.value,
                              }));
                            }}
                            className="py-4 px-5 pl-14 text-black rounded-md border border-slate-300 placeholder:text-black text-sm max-w-sm w-full"
                            placeholder="Ссылка на 2ГИС"
                            minLength={1}
                            maxLength={255}
                          />
                        </div>
                        <div className="relative mt-4 flex items-center">
                          <Image
                            width={24}
                            height={24}
                            alt=""
                            unoptimized
                            quality={100}
                            src="/instagram.png"
                            className="absolute left-5"
                          />
                          <Input
                            type="url"
                            name="instagram"
                            onChange={(e) => {
                              setContacts((prev: any) => ({
                                ...prev.contacts,
                                instagram: e.target.value,
                              }));
                            }}
                            className="py-4 px-5 pl-14 text-black rounded-md border border-slate-300 placeholder:text-black text-sm max-w-sm w-full"
                            placeholder="Ссылка на Instagram"
                            minLength={1}
                            maxLength={255}
                          />
                        </div>
                        <div className="relative mt-4 flex items-center">
                          <Image
                            width={24}
                            height={24}
                            alt=""
                            unoptimized
                            quality={100}
                            src="/whatsapp.png"
                            className="absolute left-5"
                          />
                          <Input
                            type="url"
                            name="whatsapp"
                            onChange={(e) => {
                              setContacts((prev: any) => ({
                                ...prev.contacts,
                                whatsapp: e.target.value,
                              }));
                            }}
                            className="py-4 px-5 pl-14 text-black rounded-md border border-slate-300 placeholder:text-black text-sm max-w-sm w-full"
                            placeholder="Ссылка на WhatsApp"
                            minLength={1}
                            maxLength={255}
                          />
                        </div>
                        <div className="relative mt-4 flex  items-center">
                          <Image
                            width={24}
                            height={24}
                            alt=""
                            unoptimized
                            quality={100}
                            src="/website.png"
                            className="absolute left-5"
                          />
                          <Input
                            type="url"
                            name="website"
                            className="py-4 px-5 pl-14 text-black rounded-md border border-slate-300 placeholder:text-black text-sm max-w-sm w-full"
                            placeholder="Ссылка на сайт"
                            minLength={1}
                            maxLength={255}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pb-3">
                        <Button variant="outline" onClick={editGeneralInfo}>
                          Отмена
                        </Button>
                        <Button variant="black" type="submit">
                          Сохранить
                        </Button>
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
                  {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                  <select
                    onChange={handleSelectChange}
                    id="tabs"
                    name="tabs"
                    className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                    defaultValue={`/app/profiles/${id}/educations`}
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
                                      pathname: `/app/profiles/${id}/educations`,
                                      query: { itemId: item.id },
                                    });
                                  }}
                                >
                                  <Pen className="h-6 w-6" />
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline">
                                      <Trash className="h-6 w-6" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Удалить образование?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Восстановить образование будет
                                        невозможно
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Отмена
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(item.id)}
                                      >
                                        Удалить
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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
                              pathname: `/app/profiles/${id}/educations`,
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
