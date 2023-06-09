import { Pen, Trash } from "@phosphor-icons/react";
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
import DefaultAva from "../../../../images/avatars/defaultProfile.svg";

interface FormValues {
  owned_material_resources: string;
  owned_intellectual_resources: string;
}

interface FormValuesGeneral {
  industry: string;
  location: string;
  description: string;
  display_name: string;
  avatar?: File;
  instagram_url: string;
  whatsapp_url: string;
  website_url: string;
  telegram_url: string;
  two_gis_url: string;
}

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

  const { data: profile } = await api.getProfileById(
    Number.parseInt(context!.params!.id as string, 10),
    {
      headers: {
        cookie: context.req.headers.cookie,
      },
    }
  );

  if (profile.data.id) {
    const isAuthor =
      session.data.id &&
      profile.data.user_id &&
      session.data.id === profile.data.user_id;

    return {
      props: {
        data: {
          ...session,
          profile: profile!,
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
      href: `/app/profiles/${id}/educations`,
      current: false,
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

  const parsedId = Number.parseInt(id as string, 10) as number;

  const [edit, setEdit] = useState(false);
  const [contacts, setContacts] = useState({});
  const [error, setError] = useState("");
  const [editGeneral, setEditGeneral] = useState(false);

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const handleDeleteProfile = async () => {
    await api.deleteProfile(parsedId);

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
      const { data } = await api.updateProfile(Number.parseInt(id, 10), data1);
      router.reload();
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  const onSubmit2 = async (data1: FormValuesGeneral) => {
    try {
      const { data } = await api.updateProfile(Number.parseInt(id, 10), data1);
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

      <div className="min-h-screen bg-slate-50 px-5 pt-8">
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
                        src={
                          data.profile.data.avatar
                            ? `http://localhost:3333${data.profile.data.avatar.url}`
                            : DefaultAva
                        }
                        width={0}
                        height={0}
                        unoptimized
                        alt="Profile image"
                        className="mb-3 h-[106px] w-auto rounded-md object-cover"
                      />
                      <p className="text-2xl font-semibold mb-2">
                        {data.data.first_name} {data.data.last_name}
                      </p>
                      <p className=" text-sm">
                        <Input
                          {...register2("industry")}
                          placeholder={data.profile.data.industry}
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
                            placeholder={data.profile.data.location}
                          />
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Профессия</p>
                        <p className="text-sm">
                          <Input
                            {...register2("display_name")}
                            placeholder={data.profile.data.display_name}
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
                          placeholder={data.profile.data.description}
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
                            {...register2("two_gis_url")}
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
                            {...register2("instagram_url")}
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
                            {...register2("whatsapp_url")}
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
                            {...register2("website_url")}
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
                      src={
                        data.profile.data.avatar
                          ? `http://localhost:3333${data.profile.data.avatar.url}`
                          : DefaultAva
                      }
                      width={0}
                      height={0}
                      unoptimized
                      alt="Profile image"
                      className="mb-3 h-[106px] w-auto rounded-md object-cover"
                    />
                    <p className="text-2xl font-semibold">
                      {data.data.first_name} {data.data.last_name}
                    </p>
                    <p className=" text-sm">{data.profile.data.industry}</p>
                  </div>
                  <div className="mb-6 mt-3" />
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm text-slate-400">Локация</p>
                      <p className="text-sm ">{data.profile.data.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Профессия</p>
                      <p className="text-sm">
                        {data.profile.data.display_name}
                      </p>
                    </div>
                  </div>
                  <div className="mb-6 mt-4" />
                  <div>
                    <p className="text-lg font-semibold">Обо мне</p>
                    <p className="pt-3 text-sm">
                      {data.profile.data.description}
                    </p>
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
                      {data.profile.data.two_gis_url !== null ? (
                        <Link href={data.profile.data.two_gis_url}>
                          <Image
                            width={24}
                            height={24}
                            alt=""
                            unoptimized
                            quality={100}
                            src="/2gis.png"
                          />
                        </Link>
                      ) : (
                        ""
                      )}
                      {data.profile.data.instagram_url !== null ? (
                        <Link href={data.profile.data.instagram_url}>
                          <Image
                            width={24}
                            height={24}
                            alt=""
                            unoptimized
                            quality={100}
                            src="/instagram.png"
                          />
                        </Link>
                      ) : (
                        ""
                      )}
                      {data.profile.data.website_url !== null ? (
                        <Link href={data.profile.data.whatsapp_url}>
                          <Image
                            width={24}
                            height={24}
                            alt=""
                            unoptimized
                            quality={100}
                            src="/whatsapp.png"
                          />
                        </Link>
                      ) : (
                        ""
                      )}
                      {data.profile.data.telegram_url !== null ? (
                        <Link href={data.profile.data.telegram_url}>
                          <Image
                            width={24}
                            height={24}
                            alt=""
                            unoptimized
                            quality={100}
                            src="/telegram.png"
                          />
                        </Link>
                      ) : (
                        ""
                      )}
                      {data.profile.data.website_url !== null ? (
                        <Link href={data.profile.data.website_url}>
                          <Image
                            width={24}
                            height={24}
                            alt=""
                            unoptimized
                            quality={100}
                            src="/website.png"
                          />
                        </Link>
                      ) : (
                        ""
                      )}
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
                          placeholder={
                            data.profile.data.owned_material_resources!
                          }
                          {...register("owned_material_resources")}
                        />
                      </div>

                      <div />
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Интеллектуальный ресурс
                        </p>
                        <TextArea
                          {...register("owned_intellectual_resources")}
                          placeholder={
                            data.profile.data.owned_intellectual_resources!
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={editResources}>
                        Отмена
                      </Button>
                      <Button variant="black" type="submit">
                        Сохранить
                      </Button>
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
                          {data.profile.data.owned_material_resources}
                        </p>
                      </div>

                      <div />
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Интеллектуальный ресурс
                        </p>
                        <p className="text-sm">
                          {data.profile.data.owned_intellectual_resources}
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
