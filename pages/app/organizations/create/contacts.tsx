import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
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

interface FormValues {
  name: string;
  bin: string;
  description: string;
  industry: string;
  type: string;
  ownedIntellectualResources: string;
  ownedMaterialResources: string;
  perfomance: string;
}

export default function Test() {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<FormValues>({});
  const [data, setData] = useState<any>({});

  const onSubmit = async () => {
    console.log(data.contacts);
    // const { data: organization } = await api.organizations.store(data.general);

    // if (organization) {
    //   if (data.contacts) {
    //     await Promise.all([
    //       data.contacts.instagram &&
    //         api.organizations.contacts(organization.id).store({
    //           name: "Instagram",
    //           value: data.contacts.instagram,
    //           type: "URL",
    //         }),
    //       data.contacts.whatsapp &&
    //         api.organizations.contacts(organization.id).store({
    //           name: "WhatsApp",
    //           value: data.contacts.whatsapp,
    //           type: "URL",
    //         }),
    //       data.contacts["2gis"] &&
    //         api.organizations.contacts(organization.id).store({
    //           name: "2GIS",
    //           value: data.contacts["2gis"],
    //           type: "URL",
    //         }),
    //       data.contacts.website &&
    //         api.organizations.contacts(organization.id).store({
    //           name: "Вебсайт",
    //           value: data.contacts.website,
    //           type: "URL",
    //         }),
    //     ]);
    //   }

    //   if (data.files) {
    //     await Promise.all(
    //       [...data.files].map(async (file: File) => {
    //         await api.organizations
    //           .files(organization.id)
    //           .store(buildFormData(file));
    //       })
    //     );
    //   }

    //   await router.push(`/app/organizations/${organization.id}`);
    // }
  };

  return (
    <>
      <div className="h-auto bg-slate-50">
        <Navigation />
        <div className="container mx-auto mb-4 max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Профиль /</span>
            Создание организации
          </h1>

          <div>
            <div className="mt-12 bg-white border border-slate-200 rounded-lg">
              <div className="flex divide-x overflow-auto gap-4 px-5">
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
              <form className="p-12 mx-auto">
                <div className="max-w-md mx-auto">
                  <div className="font-semibold text-black text-2xl">
                    Социальные сети
                  </div>
                  <p className="text-sm text-black mt-3">
                    Укажите ссылки на аккаунты компании в социальных сетях
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
                      name="2gis"
                      onChange={(e) => {
                        setData((prev: any) => ({
                          ...prev,
                          contacts: {
                            ...prev.contacts,
                            "2gis": e.target.value,
                          },
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
                        setData((prev: any) => ({
                          ...prev,
                          contacts: {
                            ...prev.contacts,
                            instagram: e.target.value,
                          },
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
                        setData((prev: any) => ({
                          ...prev,
                          contacts: {
                            ...prev.contacts,
                            whatsapp: e.target.value,
                          },
                        }));
                      }}
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
                <div className="mt-32 flex gap-8 max-w-screen-sm w-full mx-auto">
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
    </>
  );
}
