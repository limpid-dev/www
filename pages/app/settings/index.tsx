import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Cube, UserCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../api";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/primitives/dialog";
import { Input } from "../../../components/primitives/input";
import { Label } from "../../../components/primitives/label";

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

interface FormValues {
  first_name: string;
  last_name: string;
  patronymic: string;
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

  if (session) {
    return {
      props: {
        data: {
          userInfo: session!,
        },
      },
    };
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Settings({ data }: Props) {
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInputValue(event.target.value);
  };

  const sendRequest = async () => {
    try {
      const { data: userUpdate } = await api.updateUser({ email: inputValue });

      if (userUpdate.data.id) {
        await api.logoutUser();
        await router.push({ pathname: "/" });
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        setEmailError("Введите другую почту");
      } else {
        setEmailError("Что-то пошло не так");
      }
    }
  };

  const { register, handleSubmit } = useForm<FormValues>({});

  const onSubmit = async (userData: FormValues) => {
    const { data } = await api.updateUser(userData);

    if (data.data.id) {
      router.reload();
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
                      {data.userInfo.data.last_name}{" "}
                      {data.userInfo.data.first_name}{" "}
                      {data.userInfo.data.patronymic && (
                        <span>{data.userInfo.data.patronymic}</span>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="font-semibold text-lime-600 hover:text-lime-500"
                        >
                          Изменить
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] p-6">
                        <DialogHeader>
                          <DialogTitle>Изменить ФИО</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Имя
                              </Label>
                              <Input
                                {...register("first_name")}
                                placeholder={data.userInfo.data.first_name}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Фамилия
                              </Label>
                              <Input
                                {...register("last_name")}
                                placeholder={data.userInfo.data.last_name}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Отчество
                              </Label>
                              <Input
                                {...register("patronymic")}
                                placeholder={data.userInfo.data.patronymic}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="black"
                              type="submit"
                              className="mt-4"
                            >
                              Изменить
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Электронная почта
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {data.userInfo.data.email}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="font-semibold text-lime-600 hover:text-lime-500"
                        >
                          Изменить
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] p-6">
                        <DialogHeader>
                          <DialogTitle>Изменить почту</DialogTitle>
                        </DialogHeader>
                        <form className="grid gap-4">
                          <div className="grid grid-cols-4 items-baseline gap-4">
                            <Label
                              htmlFor="name"
                              className="text-right col-span-1"
                            >
                              Почта
                            </Label>
                            <div className="col-span-3">
                              <Input
                                id="name"
                                type="email"
                                value={inputValue}
                                onChange={handleChange}
                                placeholder={data.userInfo.data.email}
                                pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&_-]+"
                                required
                              />
                              <span className="text-sm text-red-600 ml-2">
                                {emailError}
                              </span>
                            </div>
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
          </div>
        </main>
      </div>
    </>
  );
}
