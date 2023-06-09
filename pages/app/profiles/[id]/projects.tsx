import { Pen, Trash } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Options } from "../../../../components/primitives/options";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../components/primitives/select";
import { TextArea } from "../../../../components/primitives/text-area";
import getImageSrc from "../../../../hooks/get-image-url";
import DefaultAva from "../../../../images/avatars/defaultProfile.svg";

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

  const isAuthor =
    session.data.id &&
    profile.data.user_id &&
    session.data.id === profile.data.user_id;

  if (profile.data.id) {
    const { data: userProjects } = await api.getProjects(
      {
        page: 1,
        per_page: 20,
        profile_id: profile.data.id,
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
          ...session,
          profile: profile!,
          isAuthor: isAuthor!,
          projects: userProjects!,
        },
      },
    };
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProfileProjects({ data }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const parsedId = Number.parseInt(id as string, 10) as number;

  const [editGeneral, setEditGeneral] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    control,
  } = useForm<FormValuesGeneral>();

  const onSubmit2 = async (data1: FormValuesGeneral) => {
    try {
      const { data } = await api.updateProfile(parsedId, data1);
      router.reload();
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };

  const tabs = [
    { name: "Ресурсы", href: `/app/profiles/${id}`, current: false },
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
      current: true,
    },
    {
      name: "Опыт работы",
      href: `/app/profiles/${id}/experiences`,
      current: false,
    },
    {
      name: "Отзывы",
      href: `/app/profiles/${id}/reviews`,
      current: false,
    },
  ];

  const editGeneralInfo = () => {
    setEditGeneral((current: boolean) => !current);
  };

  const inputRef = useRef(null);
  const handleClick = () => {
    (inputRef.current as unknown as HTMLInputElement).click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileObj = event.target.files?.[0];
    if (!fileObj) {
      return;
    }
    try {
      const { data } = await api.updateProfile(parsedId, {
        avatar: fileObj,
      });
      if (data.data.avatar?.url) {
        router.reload();
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError("Размер не более 1 МБ");
      } else {
        console.log("Error:", error);
      }
    }
  };

  return (
    <div>
      <Navigation />

      <div className="min-h-screen bg-slate-50 px-5 pt-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="h-28"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-10 ">
            <div className="rounded-lg border sm:col-span-3">
              {editGeneral ? (
                <>
                  <div className="flex flex-col items-center gap-x-8 bg-white pt-5">
                    <Image
                      src={
                        getImageSrc(data.profile.data.avatar?.url) ?? DefaultAva
                      }
                      width={0}
                      height={0}
                      unoptimized
                      alt=""
                      className="mb-3 h-[106px] w-auto rounded-md object-cover"
                    />
                    <div>
                      <input
                        ref={inputRef}
                        style={{ display: "none" }}
                        type="file"
                        placeholder="some photo"
                        onChange={handleFileChange}
                      />
                      <Button onClick={handleClick}>Поменять фото</Button>
                      <p className="mt-2 text-xs leading-5 text-gray-400">
                        JPG или PNG. 1MB макс.
                      </p>
                      <p className="mt-2 text-xs leading-5 text-red-500 text-center">
                        {error}
                      </p>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit2(onSubmit2)}>
                    <div className="h-full bg-white px-6">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-semibold mb-2">
                          {data.profile.data.user?.first_name}{" "}
                          {data.profile.data.user?.last_name}{" "}
                        </p>
                        <Controller
                          control={control}
                          name="industry"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="px-5 text-black rounded-md flex-1 max-w-full text-ellipsis whitespace-nowrap overflow-hidden w-full">
                                <SelectValue placeholder="Сфера деятельности" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup className="overflow-auto h-[300px]">
                                  <SelectLabel>Сфера деятельности</SelectLabel>
                                  {Options.map((option) => (
                                    <SelectItem
                                      key={option.id}
                                      value={option.name}
                                    >
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="mb-6 mt-3" />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Локация</p>
                          <p className="text-sm ">
                            <Input
                              {...register("location")}
                              placeholder={data.profile.data.location}
                            />
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-2">
                            Профессия
                          </p>
                          <p className="text-sm">
                            <Input
                              {...register("display_name")}
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
                            {...register("description")}
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
                            <Input
                              type="url"
                              {...register("two_gis_url")}
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
                              {...register("instagram_url")}
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
                              {...register("whatsapp_url")}
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
                              {...register("website_url")}
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
                </>
              ) : (
                <div className="h-full bg-white px-6">
                  <div className="flex flex-col items-center justify-center pt-12">
                    <Image
                      src={
                        getImageSrc(data.profile.data.avatar?.url) ?? DefaultAva
                      }
                      width={0}
                      height={0}
                      unoptimized
                      alt="Profile image"
                      className="mb-3 h-[106px] w-auto rounded-md object-cover"
                    />
                    <p className="text-2xl font-semibold">
                      {data.profile.data.user?.first_name}{" "}
                      {data.profile.data.user?.last_name}{" "}
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
                    name="tabs"
                    className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                    defaultValue={`/app/profiles/${id}/projects`}
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
                <div className="grid gap-5 md:grid-cols-2">
                  {data.projects.data.map((item, index) => (
                    <Link key={index} href={`/app/projects/${item.id}`}>
                      <div className="grid items-center justify-center gap-4 rounded-lg border py-6 pl-6 pr-4 sm:h-48 hover:border-black sm:grid-cols-10">
                        <div className="sm:col-span-4">
                          <Image
                            src={getImageSrc(item.logo?.url) ?? DefaultAva}
                            unoptimized
                            width={0}
                            height={0}
                            className="m-auto w-[126px] rounded-md"
                            alt="test"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <div className="flex flex-col gap-1">
                            <h1 className="text-sm font-semibold">
                              {item.title}
                            </h1>
                            <p className="text-sm">{item.industry}</p>
                            <div className="flex items-center gap-4">
                              <p className=" line-clamp-2 text-sm text-slate-400">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
