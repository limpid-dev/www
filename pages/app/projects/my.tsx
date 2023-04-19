import { Plus } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
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
import testAva from "../../../images/avatars/avatar-1.jpg";

const tabs = [
  { name: "Все проекты", href: "/app/projects/", current: false },
  { name: "Мои проекты", href: "/app/projects/my", current: true },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function All() {
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(true);
  const router = useRouter();

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };
  return (
    <div>
      <Navigation />
      <div className="h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <p className=" text-sm text-slate-300">Мои проекты</p>
          <div className="my-5 flex flex-col items-end justify-end gap-4 md:mb-12 md:flex-row md:items-center  md:justify-between">
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
                  Создать проект
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать проект</DialogTitle>
                  <DialogDescription>
                    Заполните форму, чтобы создать проект.
                  </DialogDescription>
                </DialogHeader>
                <Form>
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
                  <DialogFooter>
                    <Button className="rounded-md" type="submit">
                      Создать профиль
                    </Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="grid items-center justify-center gap-4 rounded-lg border py-6 pl-6 pr-4 sm:grid-cols-10">
              <div className="sm:col-span-4 ">
                <Image
                  src={testAva}
                  className="m-auto w-[126px] rounded-lg"
                  alt="test"
                />
              </div>
              <div className="sm:col-span-6">
                <div className="flex flex-col gap-1">
                  <h1 className=" text-lg font-semibold">Кофейня-библиотека</h1>
                  <p className=" text-sm">рестораны, кафе, бары и т.д.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
