import {
  ArrowsVertical,
  Chat,
  FileVideo,
  Paperclip,
  Star,
  TagChevron,
  Trash,
  User,
} from "@phosphor-icons/react";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../api";
import { Entity } from "../../../../api/projects";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/primitives/dropdown-menu";
import { ScrollArea } from "../../../../components/primitives/scroll-area";
import { Separator } from "../../../../components/primitives/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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

export default function View() {
  const isTrue = true;
  const [isShown, setIsShown] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [sent, setSent] = useState(false);
  const parsedId = Number.parseInt(id as string, 10) as number;
  const [projectData, setProjectData] = useState<Entity>();
  const [isAuthor, setIsAuthor] = useState(false);
  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await api.projects.show(parsedId);
      const { data: file } = await api.projects.files(parsedId).index({
        page: 1,
        perPage: 100,
      });
      if (file) {
        const w = { ...data, file };
        const images = w.file.filter((item) => {
          return item.extname === ".jpg" || item.extname === ".png";
        });
        const final = { ...w, images };
        setProjectData(final);
      }
    }
    fetchProjects();
  }, [parsedId]);

  useEffect(() => {
    async function fetchAuthor() {
      const { data: authorData } = await api.projects
        .memberships(parsedId)
        .index({
          page: 1,
          perPage: 100,
        });
      const profileId1 = Number.parseInt(
        localStorage.getItem("profileId") as string,
        10
      );
      const isAuthorProfile = authorData?.some((item) => {
        return item.profileId === profileId1 && item.type === "owner";
      });
      if (isAuthorProfile) {
        setIsAuthor(isAuthorProfile);
      }
    }
    fetchAuthor();
  }, [parsedId]);

  const handleClick = (event: any) => {
    setIsShown((current: boolean) => !current);
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Проект / </span>
            {projectData?.title}
          </h1>

          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline md:justify-end">
            {isAuthor ? (
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
                      <AlertDialogAction className="bg-rose-500 hover:bg-rose-700">
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
                  <p className=" text-2xl font-semibold">Almaz Nurgali</p>
                  <p className=" text-sm">{projectData?.title}</p>
                </div>
                <Separator className="mb-6 mt-3" />
                <div className="grid gap-3">
                  <Button variant="ghost" className="w-full">
                    <div className="flex w-full items-center gap-3 text-sm font-semibold">
                      <FileVideo /> Бизнес-план
                    </div>
                    <TagChevron />
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="w-full">
                        <div className="flex w-full items-center gap-3 text-sm font-semibold">
                          <FileVideo /> Фото и видео
                        </div>
                        <TagChevron />
                      </Button>
                    </SheetTrigger>
                    <SheetContent position="right" size="default">
                      <SheetHeader>
                        <SheetTitle>Фото</SheetTitle>
                      </SheetHeader>
                      <div className="m-auto mt-16 grid w-4/5 grid-cols-3 gap-y-6">
                        {projectData?.images?.map((img, index) => (
                          <Image
                            key={index}
                            className="h-auto w-auto object-cover"
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
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleClick}
                  >
                    <div className="flex w-full items-center gap-3 text-sm font-semibold">
                      <Chat /> Обсуждение проекта
                    </div>
                    <TagChevron />
                  </Button>
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
                      <p className="text-sm">{projectData?.description}</p>
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
                          {projectData?.ownedMaterialResources}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-3">
                        <p className=" text-xl font-semibold text-slate-400">
                          Материальный ресурс
                        </p>
                        <p className="text-sm">
                          {projectData?.ownedIntellectualResources}
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
                            {projectData?.profitability}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>

                  {/* feedback */}
                  <TabsContent className="border-none" value="feedback">
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-3 rounded-xl bg-slate-100 p-6">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Image src={Test} width={32} alt="test" /> Almaz
                              Nurgali
                            </div>
                            <div className="flex gap-2 text-lime-500">
                              <Star /> 5.0
                            </div>
                          </div>
                          <p>
                            Аманжол проявил себя как ответственный, надежный и
                            добросовестный поставщик. Исполнительность,
                            постоянное развитие, индивидуальный подход к
                            заказчику, скорость выполнения поставок - это лучшие
                            отличительные черты профессионала.
                          </p>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
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
                        <DropdownMenuItem className="text-base">
                          <User className="mr-2 h-4 w-4" />
                          Участники чата
                        </DropdownMenuItem>
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
                              : "grid w-96  items-end justify-end gap-3 border bg-slate-50"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              isTrue ? "hidden" : ""
                            }`}
                          >
                            Artur Kim
                          </p>
                          <p className="text-sm">
                            Салют, я Артур. Есть опыт в работе с тепличными
                            комплексами, думаю, что смогу быть полезен. Напиши
                            мне на ватсап. 8 707 777 77 77
                          </p>
                          <div className="flex justify-end gap-3">
                            <Button variant="ghost">Отклонить</Button>
                            <Button variant="ghost">Принять</Button>
                          </div>
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
