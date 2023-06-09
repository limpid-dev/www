import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import api from "../../../../api";
import { components } from "../../../../api/api-paths";
// import { buildFormData } from "../../../../api/files";
import { Navigation } from "../../../../components/navigation";
import { Button } from "../../../../components/primitives/button";
import { Input } from "../../../../components/primitives/input";
import DefaultAva from "../../../../images/avatars/defaultProfile.svg";

interface FormValues {
  avatar?: File;
  instagram_url: string;
  whatsapp_url: string;
  website_url: string;
  telegram_url: string;
  two_gis_url: string;
}

export default function Test() {
  const router = useRouter();
  const [data, setData] = useState<components["schemas"]["Profile"]>({});
  const { register, handleSubmit, control } = useForm<FormValues>({});
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchProfiles() {
      if (router.isReady) {
        const { data: sessionData } = await api.getProfileById(
          Number.parseInt(router.query.profileId as string, 10)
        );
        setData(sessionData.data);
      }
    }
    fetchProfiles();
  }, [router.isReady, router.query.profileId]);

  const handleClick = () => {
    (inputRef.current as unknown as HTMLInputElement).click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files?.[0];
    if (!fileObj) {
      return;
    }
    api.updateProfile(Number.parseInt(router.query.profileId as string, 10), {
      avatar: fileObj,
    });
    router.reload();
  };

  const onSubmit = async (data: FormValues) => {
    const { data: profile } = await api.updateProfile(
      Number.parseInt(router.query.profileId as string, 10),
      data
    );

    await router.push(`/app/profiles/${router.query.profileId}`);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Профиль / </span>
            Создание профиля
          </h1>

          <div>
            <div className="mt-12 bg-white border border-slate-200 rounded-lg">
              <div className="flex divide-x overflow-auto gap-4 p-5">
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Общие данные
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Опыт работы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Сертификаты
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-500 text-xl">
                  Доп.материалы
                </div>
                <div className="border-b flex items-center justify-center border-slate-100 py-8 flex-1 whitespace-nowrap font-semibold text-lime-600 text-xl">
                  Соцсети
                </div>
              </div>
              <div className="flex justify-center items-center flex-col">
                <div className="col-span-full flex items-center gap-x-8">
                  <Image
                    src={
                      data.avatar
                        ? `https://api.limpid.kz${data.avatar.url}`
                        : DefaultAva
                    }
                    width={0}
                    height={0}
                    unoptimized
                    alt=""
                    className=" h-44 w-44 flex-none rounded-lg bg-gray-100 object-cover"
                  />
                  <div>
                    <input
                      ref={inputRef}
                      style={{ display: "none" }}
                      type="file"
                      placeholder="shitty"
                      onChange={handleFileChange}
                    />
                    <Button onClick={handleClick}>Поменять фото</Button>
                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      JPG или PNG. 1MB макс.
                    </p>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mx-auto">
                  <div className="max-w-md pt-6 mx-auto">
                    <div className="font-semibold text-black text-2xl">
                      Социальные сети
                    </div>
                    <p className="text-sm text-black mt-3">
                      Укажите ссылки на аккаунты компании в социальных сетях{" "}
                      <br />
                      <span className="text-xs text-slate-500">
                        (опционально)*
                      </span>
                    </p>
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
                    <div className="relative mt-4 flex items-center">
                      <Image
                        width={24}
                        height={24}
                        alt=""
                        unoptimized
                        quality={100}
                        src="/telegram.png"
                        className="absolute left-5"
                      />
                      <Input
                        type="url"
                        {...register("telegram_url")}
                        className="py-4 px-5 pl-14 text-black rounded-md border border-slate-300 placeholder:text-black text-sm max-w-sm w-full"
                        placeholder="Ссылка на Telegram"
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
                  <div className="mt-16 mb-4 flex gap-8 max-w-screen-sm w-full mx-auto">
                    <Button
                      variant="outline"
                      className="rounded-md text-black py-2 px-4  text-sm font-medium flex-1"
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      className=" py-2 rounded-md px-4 text-sm font-medium flex-1"
                    >
                      Далее
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
