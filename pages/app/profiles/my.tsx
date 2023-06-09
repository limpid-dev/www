import { CaretRight, Plus, TagChevron, Trash } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";
import api from "../../../api";
import { GeneralLayout } from "../../../components/general-layout";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/primitives/dialog";
import AnalyzingMarket from "../../../images/analyzingMarket.svg";
import NoProfiles from "../../../images/noProfiles.svg";
import onLaptop from "../../../images/onLaptop.svg";
import ProfileDefault from "../../../images/profileDefault.svg";
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

  if (session.data.id) {
    const { data: profiles } = await api.getProfiles(
      {
        page: 1,
        per_page: 20,
        user_id: session.data.id!,
      },
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );

    console.log(profiles);

    return {
      props: {
        data: {
          profiles: profiles!,
        },
      },
    };
  }
  return {
    props: {
      data: {
        profiles: null,
      },
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

function Profiles({ data }: Props) {
  const tabs = [
    { name: "Все профили", href: "/app/profiles/", current: false },
    { name: "Мои профили", href: "/app/profiles/my", current: true },
  ];

  const router = useRouter();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const handleDeleteProfile = async (profileId: number) => {
    await api.deleteProfile(profileId);

    await router.push({
      pathname: "/app/profiles/my",
    });
  };

  return (
    <div>
      <div>
        <Navigation />
        <GeneralLayout>
          <div className="my-5 flex items-center justify-center gap-4 md:mb-12 h-[42px] md:flex-row md:justify-between">
            <div>
              <div className="sm:hidden">
                <select
                  onChange={handleSelectChange}
                  id="tabs"
                  name="tabs"
                  className="block w-full rounded-md border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                  defaultValue="/app/profiles/my"
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
                          ? "bg-lime-100 text-lime-700 rounded-md"
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
                <Button variant="black" className="flex gap-3">
                  <Plus className="w-5 h-5" /> Создать профиль
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Выберите вид профиля
                  </DialogTitle>
                </DialogHeader>
                <div className="grid sm:grid-cols-2 gap-4 py-4 w-full">
                  <Link href="/app/profiles/create">
                    <div className="flex flex-col items-center rounded-lg border hover:border-black">
                      <Image src={onLaptop} alt="Нет профилей" />
                      <div className="mb-3 flex flex-col items-center">
                        <p className="text-sm font-bold sm:text-lg">
                          Личный профиль
                        </p>
                        <p className="text-xs">физического лица</p>
                      </div>
                    </div>
                  </Link>
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

          {data.profiles && data.profiles.data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {data.profiles.data.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-lg border bg-white p-4"
                >
                  <div className="grid grid-cols-10">
                    <div className="col-span-4 mr-3">
                      <Image
                        src={profile.avatar?.url ?? ProfileDefault}
                        width={0}
                        height={0}
                        unoptimized
                        alt="test"
                        className="h-32 w-32 rounded-lg object-cover bg-slate-100"
                      />
                    </div>
                    <div className="col-span-6 flex flex-col gap-2">
                      <p className="line-clamp-1 text-base sm:text-xl font-semibold">
                        {profile.display_name}
                      </p>
                      <p className="line-clamp-1 w-auto text-xs text-slate-600">
                        {profile.industry}
                      </p>
                      <div className="flex justify-between mt-6">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-10 !rounded-full !p-0 !m-0"
                            >
                              <Trash className="h-6 w-6 rounded-full " />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Удалить профиль?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Восстановить профиль будет невозможно
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProfile(profile.id!)}
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          variant="black"
                          className="w-10 !rounded-full !p-0 !m-0"
                          onClick={() =>
                            router.push(`/app/profiles/${profile.id}`)
                          }
                        >
                          <CaretRight className="h-5 w-5 rounded-full " />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-8">
              <Image src={NoProfiles} alt="Нет профилей" />
              <p className=" text-2xl font-semibold">У вас нет профиля</p>
            </div>
          )}
        </GeneralLayout>
      </div>
    </div>
  );
}

export default Profiles;
