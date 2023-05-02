import "@uppy/core/dist/style.min.css";
import "@uppy/drag-drop/dist/style.min.css";
import { Briefcase, Plus, Question } from "@phosphor-icons/react";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import api from "../../../api";
import { Entity } from "../../../api/profiles";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/primitives/dialog";
import {
  Field,
  Form,
  Input,
  Label,
  Message,
  Textarea,
} from "../../../components/primitives/form";
import { Skeleton } from "../../../components/primitives/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/primitives/tooltip";
import AnalyzingMarket from "../../../images/analyzingMarket.svg";
import NoProfiles from "../../../images/noProfiles.svg";
import onLaptop from "../../../images/onLaptop.svg";

const tabs = [
  { name: "Все профили", href: "/app/profiles/", current: false },
  { name: "Мои профили", href: "/app/profiles/my", current: true },
];

export default function All() {
  const router = useRouter();
  const [profilesData, setProfilesData] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      const data1 = await api.session.show();
      const userId = data1.data?.id;
      const { data } = await api.profiles.index({
        page: 1,
        perPage: 100,
        filters: {
          userId: userId || 0,
        },
      });

      if (data) {
        setProfilesData(data);
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const handleOrganizationCreate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as {
      name: string;
      bin: string;
      description: string;
      industry: string;
      ownedIntellectualResources: string;
      ownedMaterialResources: string;
      type: string;
      perfomance: string;
    };

    const { data, error } = await api.organizations.store(values);

    if (data) {
      await router.push({
        pathname: "/app/profiles/organizations/" + data.id,
      });
    }
  };

  const handleProfileCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as {
      title: string;
      description: string;
      location: string;
      industry: string;
      ownedIntellectualResources: string;
      ownedMaterialResources: string;
    };

    const { data, error } = await api.profiles.store({
      title: values.title,
      location: values.location,
      description: values.description,
      industry: values.industry,
      ownedIntellectualResources: values.ownedIntellectualResources,
      ownedMaterialResources: values.ownedMaterialResources,
    });

    if (data) {
      await router.push({
        pathname: "/app/profiles/" + data.id,
      });
    }
  };

  return (
    <div>
      <Navigation />
      <div className="h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <p className=" text-sm text-slate-300">Профили</p>
          <div className="my-5 flex flex-col items-center justify-end gap-4 md:mb-12 md:flex-row  md:justify-between">
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
                          ? "bg-lime-100 text-lime-700"
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex gap-1 bg-black text-xs hover:bg-slate-700 sm:text-sm">
                  <Plus /> Создать профиль
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[775px]">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Выберите вид профиля
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Dialog>
                    <DialogTrigger>
                      <div className="flex flex-col items-center rounded-lg border hover:border-black">
                        <Image src={onLaptop} alt="Нет профилей" />
                        <div className="mb-3 flex flex-col items-center">
                          <p className="text-sm font-bold sm:text-lg">
                            Личный профиль
                          </p>
                          <p className="text-xs">физического лица</p>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle> Создание профиля</DialogTitle>
                        <DialogDescription>
                          Заполните форму, чтобы создать профиль.
                        </DialogDescription>
                      </DialogHeader>
                      <Form onSubmit={handleProfileCreate}>
                        <Field name="title">
                          <div className="flex justify-between">
                            <Label>Название</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Question className="h-6 w-6" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Опишите вашу позицию</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Input
                            placeholder="Web-Разработчик..."
                            required
                            minLength={1}
                            maxLength={255}
                          />
                          <Message match="tooShort">
                            Название профиля должно быть не менее 1 символа
                          </Message>
                          <Message match="tooLong">
                            Название профиля должно быть не более 255 символов
                          </Message>
                          <Message match="valueMissing">
                            Название профиля обязательно
                          </Message>
                        </Field>
                        <Field name="location">
                          <Label>Локация</Label>
                          <Input
                            placeholder="Астана, Казахстан..."
                            required
                            minLength={1}
                            maxLength={255}
                          />
                          <Message match="tooShort">
                            Локация профиля должна быть не менее 1 символа
                          </Message>
                          <Message match="tooLong">
                            Локация профиля должна быть не более 255 символов
                          </Message>
                          <Message match="valueMissing">
                            Локация профиля обязательна
                          </Message>
                        </Field>
                        <Field name="industry">
                          <Label>Сфера деятельности</Label>
                          <Input
                            placeholder="Информационные технологии..."
                            required
                            minLength={1}
                            maxLength={255}
                          />
                          <Message match="tooShort">
                            Сфера деятельности профиля должна быть не менее 1
                            символа
                          </Message>
                          <Message match="tooLong">
                            Сфера деятельности профиля должна быть не более 255
                            символов
                          </Message>
                          <Message match="valueMissing">
                            Сфера деятельности профиля обязательна
                          </Message>
                        </Field>
                        <Field name="description">
                          <Label>Описание</Label>
                          <Textarea
                            placeholder="Кратко опишите себя..."
                            required
                            minLength={1}
                            maxLength={1024}
                          />
                          <Message match="tooShort">
                            Описание профиля должна быть не менее 1 символа
                          </Message>
                          <Message match="tooLong">
                            Описание профиля должна быть не более 1024 символов
                          </Message>
                          <Message match="valueMissing">
                            Описание профиля обязательна
                          </Message>
                        </Field>
                        <Field name="ownedMaterialResources">
                          <Label>Материальные ресурсы</Label>
                          <Textarea
                            placeholder="Кратко опишите что вы можете предложить.."
                            required
                            minLength={1}
                            maxLength={1024}
                          />
                        </Field>
                        <Field name="ownedIntellectualResources">
                          <Label>Интеллектуальные ресурсы</Label>
                          <Textarea
                            placeholder="Кратко опишите себя..."
                            required
                            minLength={1}
                            maxLength={1024}
                          />
                        </Field>

                        <DialogFooter>
                          <Button type="submit" className="rounded-lg">
                            Создать профиль
                          </Button>
                        </DialogFooter>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Link
                    href="/app/organizations/create"
                    className="flex flex-col items-center justify-center rounded-lg border  hover:border-black"
                  >
                    <Image src={AnalyzingMarket} alt="Нет профилей" />
                    <div className="mb-3 flex flex-col items-center">
                      <p className="text-sm font-bold sm:text-lg">
                        Профиль организации
                      </p>
                      <p className="text-xs">для юридического лица</p>
                    </div>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <Skeleton className="h-[127px] w-[400px] rounded-md" />
            </div>
          ) : (
            <>
              {profilesData.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {profilesData.map((profile, profileIndex) => (
                    <Link
                      key={profileIndex}
                      href={`/app/profiles/${profile.id}`}
                    >
                      <div className=" flex w-auto flex-col items-center justify-center rounded-lg border-[1px] bg-white py-9 font-semibold hover:border-slate-700 sm:max-w-[400px]">
                        <Briefcase className="h-6 w-6" />
                        <p className="w-[203px] text-center text-base sm:text-xl ">
                          {profile.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-8">
                  <Image src={NoProfiles} alt="Нет профилей" />
                  <p className=" text-2xl font-semibold">У вас нет профиля</p>
                </div>
              )}
            </>
          )}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3" />
        </div>
      </div>
    </div>
  );
}
