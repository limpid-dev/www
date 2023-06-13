import { Pen, Plus, Power, Trash } from "@phosphor-icons/react";
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
import { CertificationCreate } from "../../../../components/profiles/create/certification";
import SkillsCreate from "../../../../components/profiles/create/skills";
import DefaultAva from "../../../../images/avatars/defaultProfile.svg";
import Badge from "../../../../images/badge.svg";

interface FormValuesGeneral {
  industry: string;
  location: string;
  description: string;
  display_name: string;
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

  const { data: certificates } = await api.getCertificates(
    {
      path: { profile_id: Number.parseInt(context!.params!.id as string, 10) },
      query: { page: 1, per_page: 10 },
    },
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

  const { data: skills } = await api.getSkills(
    {
      path: { profile_id: Number.parseInt(context!.params!.id as string, 10) },
      query: { page: 1, per_page: 10 },
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
        ...session!,
        isAuthor: isAuthor!,
        certifications: certificates!,
        skills: skills!,
        profile: profile!,
      },
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Certifications({ data }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const parsedId = Number.parseInt(id as string, 10) as number;
  const [error, setError] = useState<string>();
  const tabs = [
    { name: "Ресурсы", href: `/app/profiles/${id}/`, current: false },
    {
      name: "Образование",
      href: `/app/profiles/${id}/educations`,
      current: false,
    },
    {
      name: "Сертификаты",
      href: `/app/profiles/${id}/certifications`,
      current: true,
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

  const [certificate, setCertificate] = useState(true);
  const [skill, setSkill] = useState(true);
  const [editGeneral, setEditGeneral] = useState(false);
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm<FormValuesGeneral>();

  const onSubmit2 = async (data1: FormValuesGeneral) => {
    try {
      const { data } = await api.updateProfile(
        Number.parseInt(id as string, 10),
        data1
      );
      router.reload();
    } catch (error) {
      setError("Что то пошло не так, попробуйте позже");
    }
  };
  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const skillAdd = () => {
    setSkill((current: boolean) => !current);
  };

  const certificateAdd = () => {
    setCertificate((current: boolean) => !current);
  };

  const handleDeleteProfile = async () => {
    await api.deleteProfile(parsedId);

    await router.push({
      pathname: "/app/profiles/my",
    });
  };

  const handleDeleteCertificate = async (certificateId: number) => {
    try {
      await api.deleteCertificate({
        profile_id: parsedId,
        certificate_id: certificateId,
      });
      await router.reload();
    } catch (error) {
      console.error("Failed to delete certificate:", error);
    }
  };
  const handleDeleteSkill = async (skillId: number) => {
    await api.deleteSkill({
      path: { profile_id: parsedId, skill_id: skillId },
    });
    router.reload();
  };

  const editGeneralInfo = () => {
    setEditGeneral((current: boolean) => !current);
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
                        src={
                          data.profile.data.avatar
                            ? `/api/${data.profile.data.avatar.url}`
                            : DefaultAva
                        }
                        width={0}
                        height={0}
                        unoptimized
                        alt="Profile image"
                        className="mb-3 h-[106px] w-auto rounded-md object-cover"
                      />
                      <p className="text-2xl font-semibold mb-2">
                        {data.profile.data.user?.first_name}{" "}
                        {data.profile.data.user?.last_name}{" "}
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
                          ? `/api/${data.profile.data.avatar.url}`
                          : DefaultAva
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
                    onChange={handleSelectChange}
                    id="tabs"
                    name="tabs"
                    className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                    defaultValue={`/app/profiles/${id}/certification`}
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
                <p className="mb-6 text-xl font-semibold text-slate-400">
                  Сертификаты
                </p>
                {certificate ? (
                  <>
                    {data.certifications.data.map(
                      (certificate, certificateIndex) => (
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
                              <Link
                                target="_blank"
                                href={`/api/${certificate.attachment?.url}`}
                              >
                                <p className="text-sm font-medium text-sky-500">
                                  Смотреть сертификат
                                </p>
                              </Link>
                            </div>
                          </div>
                          {data.isAuthor ? (
                            <div className=" flex items-end justify-end text-sm font-medium text-red-500 mt-2">
                              <Button
                                onClick={() => {
                                  handleDeleteCertificate(certificate.id);
                                }}
                                variant="ghost"
                              >
                                Удалить сертификат
                              </Button>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      )
                    )}
                    {data.isAuthor && (
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
                      {data.skills.data.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="flex items-center gap-3"
                        >
                          <div className="flex items-center gap-3 rounded-md bg-slate-100 px-4 py-3 text-sm">
                            <Power />
                            <p>{skill.name}</p>
                          </div>
                          {data.isAuthor && (
                            <Button
                              variant="outline"
                              color="zinc"
                              onClick={() => handleDeleteSkill(skill.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {data.isAuthor && (
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
