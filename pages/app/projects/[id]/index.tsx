import {
  ArrowRight,
  ArrowsVertical,
  Chat,
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
import { useRouter } from "next/router";
import React, { useState } from "react";
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
  const session = await api.session.show({
    headers: {
      Cookie: context.req.headers.cookie!,
    },
    credentials: "include",
  });

  const { data: project } = await api.projects.show(Number(context.params!.id));

  const { data: file } = await api.projects
    .files(Number(context.params!.id))
    .index({
      page: 1,
      perPage: 100,
    });

  const { data: membershipData } = await api.projects
    .memberships(Number(context.params!.id))
    .index({
      page: 1,
      perPage: 100,
    });

  const isAuthor = membershipData?.some((item) => {
    return item.type === "owner" && item.profileId === session.data?.id;
  });

  const acceptMembers = membershipData?.filter((item) => {
    return item.type === "member" && !item.acceptedAt;
  });

  const activeMember = membershipData?.some((item) => {
    return item.profileId === session.data?.id;
  });

  const withProfiles = membershipData!.map(async (d) => {
    const profile = await api.profiles.show(d.profileId!);
    return { ...d, profile: profile.data! };
  });

  const w = await Promise.all(withProfiles);

  if (file) {
    const images = file.filter((item) => {
      return item.extname === ".jpg" || item.extname === ".png";
    });
    return {
      props: {
        data: {
          project: project!,
          file: file!,
          images: images!,
          membershipData: w!,
          isAuthor: isAuthor!,
          acceptMembers: acceptMembers!,
          activeMember: activeMember!,
        },
      },
    };
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProjectView({ data }: Props) {
  const isTrue = false;
  const [isShown, setIsShown] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [sent, setSent] = useState(false);
  const parsedId = Number.parseInt(id as string, 10) as number;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>();

  const onSubmit = async (data1: FormValues) => {
    try {
      const profileId = localStorage.getItem("profileId");
      const w = { profileId, ...data1 };
      const { data } = await api.projects.memberships(parsedId).store(w);
      if (data) {
        setSent(true);
      }
    } catch (error) {}
  };

  const handleClick = (event: any) => {
    setIsShown((current: boolean) => !current);
  };

  const handleAccept = async () => {
    const { data } = await api.projects
      .memberships(parsedId)
      .update(accept[0].id);
  };
  return (
    <div>
      <Navigation />
      <div className="min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Проект / </span>
            {data.project.title}
          </h1>

          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline md:justify-end">
            {data.isAuthor ? (
              <div className="flex gap-5">
                <Button className="bg-slate-700 hover:bg-black">
                  Редактировать
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger className="rounded-lg border p-2 hover:bg-slate-100">
                    <Trash />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="flex flex-col items-center justify-center">
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
                  <DialogContent>
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
                    src={Test}
                    alt="Photo by Alvaro Pinot"
                    className="h-[106px] w-auto rounded-md object-cover pb-6"
                  />
                  <p className=" text-2xl font-semibold">
                    {data.project.title}
                  </p>
                  <p className=" text-sm">{data.project.title}</p>
                </div>
                <Separator className="mb-6 mt-3" />
                <div className="grid gap-3">
                  <Button variant="ghost" className="w-full">
                    <div className="flex w-full items-center gap-3 text-sm font-semibold">
                      <Files className="w-6 h-6" />
                      Бизнес-план
                    </div>
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="w-full">
                        <div className="flex w-full items-center gap-3 text-sm font-semibold">
                          <FileVideo className="w-6 h-6" /> Фото и видео
                        </div>
                        <ArrowRight className="w-6 h-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent position="right" size="default">
                      <SheetHeader>
                        <SheetTitle>Фото</SheetTitle>
                      </SheetHeader>
                      <div className="m-auto mt-16 grid w-4/5 grid-cols-1 sm:grid-cols-3 gap-6">
                        {data.images.map((img, index) => (
                          <Image
                            key={index}
                            className="h-auto w-auto object-cover rounded-md"
                            width={0}
                            height={0}
                            unoptimized
                            src={img.url}
                            alt="test"
                          />
                        ))}
                      </div>
                      <Separator className="my-7" />
                      <p>Видео</p>
                      <div className="m-auto mt-16 grid w-4/5 gap-y-6">
                        <Image src={Test} alt="test" />
                      </div>
                      <div />
                    </SheetContent>
                  </Sheet>

                  {data.activeMember && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={handleClick}
                    >
                      <div className="flex w-full items-center gap-3 text-sm font-semibold">
                        <Chat /> Обсуждение проекта
                      </div>{" "}
                      <TagChevron />
                    </Button>
                  )}
                </div>
                {/* <Separator className="mb-6 mt-4" />
              <div className="flex flex-col gap-4">
                <p className="w-fit rounded-xl bg-slate-100 p-2 text-sm">
                  участников в проекте: 1
                </p>
                <p className="w-fit rounded-xl bg-slate-100 p-2 text-sm">
                  желаемых партнеров: 1
                </p>
                <p className="w-fit rounded-xl bg-slate-100 p-2 text-sm">
                  участников в проекте: 1
                </p>
              </div> */}
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
                      <p className="text-sm">{data.project.description}</p>
                    </div>
                  </TabsContent>

                  {/* resource */}

                  <TabsContent className="border-none" value="resource">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Материальный ресурс
                        </p>
                        <p className="text-sm">
                          {data.project.ownedMaterialResources}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Интеллектуальный ресурс
                        </p>
                        <p className="text-sm">
                          {data.project.ownedIntellectualResources}
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
                            Ожидаемая рентабельность
                          </p>
                          <p className="text-sm">
                            {data.project.profitability}
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
                      variant="ghost"
                      className="px-2"
                      onClick={handleClick}
                    >
                      <TagChevron />
                    </Button>
                    <p className="text-lg font-semibold">Обсуждение проекта</p>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 rounded-lg p-2 text-sm font-medium hover:bg-slate-100">
                        <ArrowsVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Dialog>
                          <DialogTrigger className="text-base w-full p-2">
                            Участники проекта
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Участники Обсуждения</DialogTitle>
                            </DialogHeader>
                            {data.membershipData.map((member) => (
                              <div key={member.id}>
                                <p>{member.profile.title}</p>
                              </div>
                            ))}
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
                      <div
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
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="flex items-center justify-around px-6 pb-3">
                    <TextArea
                      placeholder="Сообщение"
                      className="h-10 w-[90%]"
                    />
                    <Button variant="outline" className="bg-slate-100">
                      <Paperclip />
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
