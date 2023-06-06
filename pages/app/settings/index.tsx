import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Switch } from "@headlessui/react";
import { Cube, UserCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useRef, useState } from "react";
import api from "../../../api";
// import { buildFormData } from "../../../api/files";
import { Navigation } from "../../../components/navigation";
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
} from "../../../components/primitives/alert-dialog";
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
import { Input } from "../../../components/primitives/input";
import { Label } from "../../../components/primitives/label";
import DefaultAva from "../../../images/avatars/defaultProfile.svg";

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

const secondaryNavigation = [
  { name: "Аккаунт", href: "#", icon: UserCircle, current: true },
  {
    name: "План подписки",
    href: "/app/settings/plan",
    icon: Cube,
    current: false,
  },
];

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { data: session } = await api.session.show({
    headers: {
      Cookie: context.req.headers.cookie!,
    },
    credentials: "include",
  });

  if (session) {
    const { data: user } = await api.users.show(session.id);

    return {
      props: {
        data: {
          userInfo: user!,
        },
      },
    };
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Settings({ data }: Props) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [privateAccount, setPrivateAccount] = useState(false);

  const handleClick = () => {
    (inputRef.current as unknown as HTMLInputElement).click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files?.[0];
    if (!fileObj) {
      return;
    }
    api.users.avatar(data.userInfo.id, buildFormData(fileObj));
    router.reload();
  };

  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setInputValue(event.target.value);
  };

  const sendRequest = async () => {
    const { data: userUpdate } = await api.users.update(data.userInfo.id, {
      email: inputValue,
    });
    if (userUpdate) {
      await api.session.destroy();
      await router.push({
        pathname: "/",
      });
    }
  };

  return (
    <>
      <Navigation />

      <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
        <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-16">
          <nav className="flex-none px-4 sm:px-6 lg:px-0">
            <ul className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={clsx(
                      item.current
                        ? "bg-gray-50 text-lime-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-lime-600",
                      "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6"
                    )}
                  >
                    <item.icon
                      className={clsx(
                        item.current
                          ? "text-lime-600"
                          : "text-gray-400 group-hover:text-lime-600",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-16">
          <div className="mx-auto max-w-2xl space-y-16 lg:mx-0 lg:max-w-none">
            <div className="col-span-full flex items-center gap-x-8">
              <Image
                src={
                  data.userInfo.file && data.userInfo.file.url
                    ? data.userInfo.file.url
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
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Ваша информация
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Эта информация будет отображаться публично, поэтому будьте
                осторожны с тем, чем вы делитесь.
              </p>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Полное имя
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {data.userInfo.lastName} {data.userInfo.firstName}
                    </div>
                    <button
                      type="button"
                      className="font-semibold text-lime-600 hover:text-lime-500"
                    >
                      Изменить
                    </button>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Электронная почта
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{data.userInfo.email}</div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="font-semibold text-lime-600 hover:text-lime-500"
                        >
                          Изменить
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] p-10">
                        <DialogHeader>
                          <DialogTitle>Изменить почту</DialogTitle>
                        </DialogHeader>
                        <form className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Почта
                            </Label>
                            <Input
                              id="name"
                              value={inputValue}
                              onChange={handleChange}
                              placeholder="Новая почта"
                              className="col-span-3"
                            />
                          </div>
                        </form>
                        <DialogFooter>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="black">Изменить</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Изменить почту?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Вы будете должны верифицировать почту
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => sendRequest()}
                                >
                                  Изменить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="divide-y divide-gray-200">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Приватность
                </h2>
              </div>
              <ul className="mt-2 divide-y divide-gray-200">
                <Switch.Group
                  as="li"
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex flex-col">
                    <Switch.Label
                      as="p"
                      className="text-sm font-medium leading-6 text-gray-900"
                      passive
                    >
                      Режим инкогнито
                    </Switch.Label>
                    <Switch.Description className="text-sm text-gray-500">
                      Никто не увидит ваши данные без вашего подтверждения
                    </Switch.Description>
                  </div>
                  <Switch
                    checked={privateAccount}
                    onChange={setPrivateAccount}
                    className={classNames(
                      privateAccount ? "bg-lime-500" : "bg-gray-200",
                      "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        privateAccount ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </Switch.Group>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
