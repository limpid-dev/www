import { Briefcase, CaretRight, Plus } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import api from "../../../api";
import { BadRequest, Validation } from "../../../api/errors";
import { Navigation } from "../../../components/Navigation";
import { Button } from "../../../components/Primitives/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/Primitives/Dialog";
import {
  Field,
  Form,
  Input,
  Label,
  Message,
  Textarea,
} from "../../../components/Primitives/Form";

const tabs = [
  { name: "Все профили", href: "/app/profiles/", current: false },
  { name: "Мои профили", href: "/app/profiles/my", current: true },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function All() {
  const [search, setSearch] = useState("");

  const router = useRouter();

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    location: false,
    industry: false,
    ownedIntellectualResources: false,
    ownedMaterialResources: false,
  });
  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
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

    const { error } = await api.profiles.store({
      title: values.title,
      location: values.location,
      description: values.description,
      industry: values.industry,
      ownedIntellectualResources: values.ownedIntellectualResources,
      ownedMaterialResources: values.ownedMaterialResources,
    });

    // if (Validation.is(error)) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     email: true,
    //   }));
    //   return;
    // }
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
                  className="block w-full rounded-md border-gray-300 focus:border-lime-500 focus:ring-lime-500"
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
                      className={classNames(
                        tab.current
                          ? "bg-lime-100 text-lime-700"
                          : "text-gray-500 hover:text-gray-700",
                        "rounded-md px-3 py-2 text-sm font-medium"
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
              <DialogTrigger>
                <div className="flex items-center gap-2 rounded-lg bg-zinc-900 p-2 text-sm text-white">
                  <Plus className="h-6 w-6" />
                  Создать профиль
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать профиль</DialogTitle>
                  <DialogDescription>
                    Заполните форму, чтобы создать профиль.
                  </DialogDescription>
                </DialogHeader>
                <Form onSubmit={handleProfileCreate}>
                  <Field name="title">
                    <Label>Название</Label>
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
                      Сфера деятельности профиля должна быть не менее 1 символа
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
                    <Textarea
                      placeholder="Кратко опишите себя..."
                      required
                      minLength={1}
                      maxLength={1024}
                    />
                  </Field>
                  <Field name="ownedIntellectualResources">
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
          </div>

          <div className="grid justify-center gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-[300px] rounded-2xl border border-slate-200 bg-white md:w-auto">
              <div className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="mb-2.5 flex flex-row justify-between">
                    <div className="flex gap-2">
                      <p className="text-sm">#120</p>
                      <p className="text-base text-slate-400">Поехали с нами</p>
                    </div>
                    <p className=" text-sm text-slate-400">02.01.2023</p>
                  </div>
                  <div className="mb-2.5 flex flex-row justify-between">
                    <p className="text-base font-semibold">
                      Менеджер по туризму
                    </p>
                    <p className="rounded-2xl bg-lime-500 px-2 py-1 text-xs font-bold text-slate-100">
                      в ТОПе
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5">
                    <p className="text-sm text-slate-400">Заявки</p>
                    <p className="w-fit items-center justify-center rounded-2xl bg-sky-50 px-2 pt-0.5 text-center text-xs text-sky-500">
                      5
                    </p>
                    <p className="text-sm text-slate-400">Статус</p>
                    <p className="w-fit items-center justify-center rounded-2xl bg-sky-50 px-2 pt-0.5 text-center text-xs text-sky-500">
                      опубликован
                    </p>
                    <p className="text-sm text-slate-400">Прием заявок</p>
                    <p className="w-fit items-center justify-center rounded-2xl bg-sky-50 px-2 pt-0.5 text-center text-xs text-sky-500">
                      до 24.01.2023, 14:00
                    </p>
                  </div>
                </div>
                <div className="my-6" />
                <div className="flex items-center justify-end">
                  <Button className="rounded-full bg-slate-300 px-2 py-1.5 hover:bg-black">
                    <CaretRight />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
