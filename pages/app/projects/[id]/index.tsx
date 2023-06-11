import {
  ArrowLeft,
  ArrowRight,
  ArrowsVertical,
  Chat,
  DotsThreeVertical,
  DownloadSimple,
  Files,
  FileVideo,
  Paperclip,
  TagChevron,
  Trash,
} from "@phosphor-icons/react";
import { DialogClose } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/primitives/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../../../components/primitives/dropdown-menu";
import { ScrollArea } from "../../../../components/primitives/scroll-area";
import { Separator } from "../../../../components/primitives/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/primitives/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/primitives/tabs";
import { TextArea } from "../../../../components/primitives/text-area";
import Test from "../../../../images/avatars/defaultProfile.svg";
import SentImage from "../../../../images/email 1.png";

interface FormValues {
  message: string;
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
    session.data.selected_profile_id,
    {
      headers: {
        cookie: context.req.headers.cookie,
      },
    }
  );

  const { data: project } = await api.getProject(
    Number.parseInt(context!.params!.id as string, 10),
    {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    }
  );

  const { data: projectMemberShip } = await api.getProjectMembers(
    {
      project_id: Number.parseInt(context!.params!.id as string, 10),
      page: 1,
      per_page: 10,
    },
    {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    }
  );

  console.log(projectMemberShip.data);

  const isAuthor = profile.data.id === project.data.profile_id;

  return {
    props: {
      data: {
        project: project!,
        isAuthor: isAuthor!,
      },
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProjectView({ data }: Props) {
  const isTrue = false;
  const [isShown, setIsShown] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [sent, setSent] = useState(false);
  const parsedId = Number.parseInt(id as string, 10) as number;
  const [largeScreen, setLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newScreenWidth = window.innerWidth;
      setLargeScreen(newScreenWidth > 896);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>();

  const onSubmit = async (data1: FormValues) => {
    // try {
    //   const profileId = localStorage.getItem("profileId");
    //   const w = { profileId, ...data1 };
    //   const { data } = await api.projects.memberships(parsedId).store(w);
    //   if (data) {
    //     setSent(true);
    //   }
    // } catch (error) {}
  };

  const handleClick = (event: any) => {
    setIsShown((current: boolean) => !current);
  };

  // const handleAccept = async () => {
  //   const { data } = await api.projects
  //     .memberships(parsedId)
  //     .update(accept[0].id);
  // };
  return (
    <div>
      <Navigation />
      <div className=" min-h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Проект / </span>
            {data.project.data.title}
          </h1>

          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline md:justify-end">
            {data.isAuthor ? (
              <div className="flex gap-5">
                <Button variant="black">Редактировать</Button>
                <AlertDialog>
                  <AlertDialogTrigger className="rounded-lg border p-2 hover:bg-slate-100">
                    <Trash />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="flex flex-col items-center justify-center p-6">
                    <AlertDialogHeader className="mb-3">
                      <AlertDialogTitle className="text-center">
                        Удалить проект?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-center text-slate-900">
                        Восстановить проект будет невозможно
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        className={clsx("bg-rose-500 hover:bg-rose-700")}
                      >
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="flex flex-col gap-5 sm:flex-row">
                <Dialog>
                  <DialogTrigger className="rounded-md bg-slate-700 p-2 text-sm text-white hover:bg-black">
                    Заинтересоваться проектом
                  </DialogTrigger>
                  <DialogContent className="p-6 max-w-lg">
                    {sent ? (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Image src={SentImage} alt="s" />
                        <p className=" font-semibold text-2xl">
                          Заявка успешно отправлена
                        </p>
                        <p>Ожидайте ответ от автора проекта</p>
                        <DialogClose>
                          <Button variant="outline">Понятно</Button>
                        </DialogClose>
                      </div>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle>Отправить заявку</DialogTitle>
                          <DialogDescription>
                            Напишите чем вы будете полезны проекту ?
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="flex flex-col items-end"
                        >
                          <TextArea {...register("message")} />
                          <Button className="mt-4" variant="outline">
                            Отправить
                          </Button>
                        </form>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          <div className="grid min-h-[650px] grid-cols-1 gap-6 sm:grid-cols-10 ">
            <div className="rounded-lg border sm:col-span-3">
              <div className="h-full bg-white px-6">
                <div className="flex flex-col items-center justify-center pt-12">
                  <Image
                    src={
                      data.project.data.logo?.url
                        ? `${process.env.NEXT_PUBLIC_API_URL}${data.project.data.logo.url}`
                        : Test
                    }
                    alt="Photo by Alvaro Pinot"
                    width={0}
                    unoptimized
                    height={0}
                    className="h-[106px] w-auto rounded-md object-cover pb-6"
                  />
                  <p className=" text-2xl font-semibold">
                    {data.project.data.title}
                  </p>
                  <p className=" text-sm">{data.project.data.industry}</p>
                </div>
                <Separator className="mb-6 mt-3" />
                <div className="grid gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="w-full">
                        <div className="flex w-full items-center gap-3 text-sm font-semibold">
                          <Files className="w-6 h-6" />
                          Бизнес-план
                        </div>
                        <ArrowRight className="w-6 h-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      position="right"
                      size={largeScreen ? "default" : "full"}
                    >
                      <SheetHeader>
                        <SheetTitle>Бизнес-план</SheetTitle>
                        <Link
                          href={
                            data.project.data.business_plan?.url
                              ? `${process.env.NEXT_PUBLIC_API_URL}${data.project.data.business_plan.url}`
                              : Test
                          }
                        >
                          <div className=" flex w-auto flex-col items-center justify-center rounded-lg border-[1px] bg-white py-8 font-semibold hover:border-slate-700 sm:max-w-[400px]">
                            <DownloadSimple className="h-14 w-14" />
                            <p className="mt-3 text-center text-base sm:text-xl ">
                              {data.project.data.title}
                            </p>
                          </div>
                        </Link>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="w-full">
                        <div className="flex w-full items-center gap-3 text-sm font-semibold">
                          <FileVideo className="w-6 h-6" /> Фото и видео
                        </div>
                        <ArrowRight className="w-6 h-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      position="right"
                      size={largeScreen ? "default" : "full"}
                    >
                      <SheetHeader>
                        <SheetTitle>Фото</SheetTitle>
                      </SheetHeader>
                      <div className="flex w-auto flex-col items-center justify-center rounded-lg bg-white py-8 font-semibold">
                        <Image
                          className="h-20 w-20 object-cover rounded-md"
                          width={0}
                          height={0}
                          unoptimized
                          src={
                            data.project.data.logo?.url
                              ? `${process.env.NEXT_PUBLIC_API_URL}${data.project.data.logo.url}`
                              : Test
                          }
                          alt="test"
                        />
                        <p className="mt-3 text-center text-base sm:text-xl ">
                          {data.project.data.title}
                        </p>
                      </div>
                      <Separator className="my-7" />
                      <p>Видео</p>
                      <div className="m-auto mt-16 grid w-4/5 gap-y-6">
                        <Image src={Test} alt="test" />
                      </div>
                      <div />
                    </SheetContent>
                  </Sheet>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleClick}
                  >
                    <div className="flex w-full items-center gap-3 text-sm font-semibold">
                      <Chat className="w-6 h-6" /> Обсуждение проекта
                    </div>
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </div>
                <div />
              </div>
            </div>

            <div className="rounded-lg border bg-white sm:col-span-7">
              {isShown ? (
                <Tabs defaultValue="about">
                  <TabsList className="flex justify-around border border-slate-100 bg-white p-9 text-lg font-semibold text-slate-300 w-full">
                    <div className="flex flex-row flex-nowrap gap-10 overflow-x-auto md:w-full md:justify-around">
                      <TabsTrigger value="about">О проекте</TabsTrigger>
                      <TabsTrigger value="resource">Ресурсы</TabsTrigger>
                      <TabsTrigger value="profitability">
                        Рентабельность
                      </TabsTrigger>
                    </div>
                  </TabsList>

                  {/* about */}

                  <TabsContent className="border-none" value="about">
                    <div className="flex flex-col gap-3">
                      <p className=" text-xl font-semibold text-slate-400">
                        О проекте
                      </p>
                      <p className="text-sm">{data.project.data.description}</p>
                    </div>
                  </TabsContent>

                  {/* resource */}

                  <TabsContent className="border-none" value="resource">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Материальные ресурсы проекта
                        </p>
                        <p className="text-sm">
                          {data.project.data.owned_material_resources}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Требуемые материальные ресурсы проекту
                        </p>
                        <p className="text-sm">
                          {data.project.data.required_material_resources}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Интеллектуальные ресурсы проекта
                        </p>
                        <p className="text-sm">
                          {data.project.data.owned_intellectual_resources}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Требуемые интеллектуальные ресурсы проекту
                        </p>
                        <p className="text-sm">
                          {data.project.data.owned_intellectual_resources}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* profitability */}
                  <div className="m-auto flex w-auto justify-center">
                    <TabsContent
                      className=" h-[500px] w-[900px] border-none"
                      value="profitability"
                    >
                      <div>
                        <div className="flex flex-col gap-3">
                          <p className=" text-xl font-semibold text-slate-400">
                            Ожидаемая рентабельность по проекту
                          </p>
                          <p className="text-sm">
                            {data.project.data.profitability}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              ) : (
                <div>
                  <div className="flex items-center justify-between bg-slate-100 p-3">
                    <Button
                      variant="subtle"
                      className="px-2"
                      onClick={handleClick}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <p className="text-lg font-semibold">Обсуждение проекта</p>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="subtle">
                          <DotsThreeVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Dialog>
                          <DialogTrigger className="text-base w-full p-2">
                            Участники проекта
                          </DialogTrigger>
                          <DialogContent className="p-6">
                            <DialogHeader>
                              <DialogTitle>Участники Обсуждения</DialogTitle>
                            </DialogHeader>
                            {/* {data.membershipData.map((member) => (
                              <div key={member.id}>
                                <p>{member.profile.title}</p>
                              </div>
                            ))} */}
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <ScrollArea className=" h-[530px]">
                    <div
                      className={`my-1 flex flex-col ${
                        isTrue ? "items-end self-end" : "items-start"
                      }`}
                    >
                      {/* <div
                        className={`mt-2 w-96 rounded-lg px-2 py-1 ${
                          isTrue ? "bg-lime-400 " : "flex items-end gap-3"
                        }`}
                      >
                        <Image
                          src={Test}
                          width={34}
                          className={` ${isTrue ? "hidden" : ""}`}
                          alt="test"
                        />
                        <div
                          className={`mt-2 rounded-lg px-2 py-1 ${
                            isTrue
                              ? "bg-lime-400"
                              : "grid max-w-96 items-end justify-end gap-3 border bg-slate-50"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              isTrue ? "hidden" : ""
                            }`}
                          >
                            {data.acceptMembers[0].id}
                          </p>
                          <>
                            <p className="text-sm">
                              {data.acceptMembers[0]?.message}
                            </p>
                          </>
                          {data.acceptMembers[0] && (
                            <div className="flex justify-end gap-3">
                              <Button variant="ghost">Отклонить</Button>
                              <Button onClick={handleAccept} variant="ghost">
                                Принять
                              </Button>
                            </div>
                          )}
                        </div>
                      </div> */}
                    </div>
                  </ScrollArea>
                  <div className="flex items-center justify-around px-6 pb-3 gap-2">
                    <TextArea placeholder="Сообщение" className="max-h-11" />
                    <Button variant="outline" className="bg-slate-100 ">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
