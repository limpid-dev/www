import {
  ArrowLeft,
  ArrowRight,
  Chat,
  DotsThreeVertical,
  DownloadSimple,
  Files,
  FileVideo,
  Paperclip,
  Pen,
  Trash,
} from "@phosphor-icons/react";
import { DialogClose } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import api from "../../../../api";
import { components } from "../../../../api/api-paths";
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
import { Input } from "../../../../components/primitives/input";
import { Options } from "../../../../components/primitives/options";
import { ScrollArea } from "../../../../components/primitives/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../components/primitives/select";
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
import getImageSrc from "../../../../get-image-url";

interface FormValues {
  application_message: string;
}

interface AboutValues {
  description: string;
}

interface ResourcesValues {
  owned_intellectual_resources: string;
  required_intellectual_resources: string;
  owned_material_resources: string;
  required_material_resources: string;
}

interface ROIValues {
  profitability: string;
}

interface GeneralValues {
  title: string;
  industry: string;
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

  if (session.data.selected_profile_id) {
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

    const isAuthor = profile.data.id === project.data.profile_id;

    return {
      props: {
        data: {
          project: project!,
          isAuthor: isAuthor!,
        },
      },
    };
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProjectView({ data }: Props) {
  const isTrue = true;
  const [isShown, setIsShown] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [sent, setSent] = useState(false);
  const parsedId = Number.parseInt(id as string, 10) as number;
  const [largeScreen, setLargeScreen] = useState(false);
  const [pendingMembers, setPendingMembers] =
    useState<components["schemas"]["ProjectMember"][]>();

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

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     api
  //       .getMessages({
  //         path: { chat_id: parsedId },
  //         query: {
  //           page: 1,
  //           per_page: 10,
  //         },
  //       })
  //       .then((response) => {
  //         console.log(response.data.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error getting messages:", error);
  //       });
  //   }, 2000);

  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const { data } = await api.getProjectMembers(parsedId, {
          page: 1,
          per_page: 10,
        });

        if (data.data) {
          setPendingMembers(data.data);
          console.log(pendingMembers);
        }
      } catch (error) {
        // Handle error if necessary
        console.error(error);
      }
    };
    fetchProjectMembers();
  }, [parsedId]);

  useEffect(() => {}, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await api.addProjectMember({ project_id: parsedId }, data);
    setSent(true);
  };

  const handleClick = (event: any) => {
    setIsShown((current: boolean) => !current);
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await api.deleteProject({ project_id: projectId });
      await router.push({
        pathname: `/app/projects/my`,
        query: {},
      });
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const [editProjectAbout, setEditProjectAbout] = useState(false);
  const editHandleAbout = () => {
    setEditProjectAbout((current: boolean) => !current);
  };

  const [editProjectResources, setEditProjectResources] = useState(false);
  const editHandleResources = () => {
    setEditProjectResources((current: boolean) => !current);
  };

  const [editProjectROI, setEditProjectROI] = useState(false);
  const editHandleROI = () => {
    setEditProjectROI((current: boolean) => !current);
  };

  const [editBusinessPlan, setEditBusinessPlan] = useState(false);
  const editHandleBusinessPlan = () => {
    setEditBusinessPlan((current: boolean) => !current);
  };

  const [editVideo, setEditVideo] = useState(false);
  const editHandleVideo = () => {
    setEditVideo((current: boolean) => !current);
  };

  const [editGeneral, setEditGeneral] = useState(false);
  const editHandleGeneral = () => {
    setEditGeneral((current: boolean) => !current);
  };

  const {
    register: registerAbout,
    handleSubmit: handleAbout,
    formState: { errors: erorsAbout },
  } = useForm<AboutValues>();

  const {
    register: registerResources,
    handleSubmit: handleResources,
    formState: { errors: errorsResources },
  } = useForm<ResourcesValues>();

  const {
    register: registerROI,
    handleSubmit: handleROI,
    formState: { errors: errorsROI },
  } = useForm<ROIValues>();

  const {
    register: registerGeneral,
    handleSubmit: handleGeneral,
    formState: { errors: errorsGeneral },
    control: controlGeneral,
  } = useForm<GeneralValues>();

  const onSubmitAbout = async (aboutFormData: any) => {
    try {
      const { data } = await api.updateProject(
        { project_id: parsedId },
        aboutFormData
      );
      if (data.data?.id) {
        router.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBusinessPlanChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileObj = event.target.files?.[0];
    if (!fileObj) {
      return;
    }
    api.updateProject(
      { project_id: parsedId },
      {
        business_plan: fileObj,
      }
    );
    router.reload();
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files?.[0];
    if (!fileObj) {
      return;
    }
    api.updateProject(
      { project_id: parsedId },
      {
        video_introduction: fileObj,
      }
    );
    router.reload();
  };

  const inputRef = useRef(null);

  const [error, setError] = useState("");

  const handleClickAvatar = () => {
    (inputRef.current as unknown as HTMLInputElement).click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileObj = event.target.files?.[0];
    if (!fileObj) {
      return;
    }
    try {
      const { data } = await api.updateProject(
        { project_id: parsedId },
        {
          logo: fileObj,
        }
      );
      if (data.data?.logo?.url) {
        router.reload();
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError("Размер не более 1 МБ");
      } else {
        console.log("Error:", error);
      }
    }
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Проект / </span>
            {data.project.data.title}
          </h1>

          <div className="my-7 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-11 md:flex-row md:items-baseline md:justify-end">
            {data.isAuthor ? (
              <div className="flex gap-5">
                <AlertDialog>
                  <AlertDialogTrigger className="rounded-lg border p-2 hover:bg-slate-100">
                    <Trash className="w-6 h-6" />
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
                        onClick={() =>
                          handleDeleteProject(data.project.data.id)
                        }
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
                          <TextArea {...register("application_message")} />
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
              <div className="h-full bg-white p-6">
                {editGeneral ? (
                  <div className="flex flex-col items-center gap-x-8 bg-white pt-5">
                    <Image
                      src={
                        data.project.data.logo?.url
                          ? `/api/${data.project.data.logo.url}`
                          : Test
                      }
                      alt="Photo by Alvaro Pinot"
                      width={0}
                      unoptimized
                      height={0}
                      className="h-[106px] w-auto rounded-md object-cover pb-6"
                    />
                    <div>
                      <input
                        ref={inputRef}
                        style={{ display: "none" }}
                        type="file"
                        placeholder="some photo"
                        onChange={handleFileChange}
                      />
                      <Button onClick={handleClickAvatar}>Поменять фото</Button>
                      <p className="mt-2 text-xs leading-5 text-gray-400">
                        JPG или PNG. 1MB макс.
                      </p>
                      <p className="mt-2 text-xs leading-5 text-red-500 text-center">
                        {error}
                      </p>
                    </div>
                    <form
                      onSubmit={handleGeneral(onSubmitAbout)}
                      className="flex flex-col gap-2"
                    >
                      <Input
                        {...registerGeneral("title")}
                        placeholder="Название"
                      />
                      <p className=" text-2xl font-semibold" />
                      <Controller
                        control={controlGeneral}
                        name="industry"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="px-5 text-black rounded-md flex-1 max-w-full text-ellipsis whitespace-nowrap overflow-hidden w-full">
                              <SelectValue placeholder="Сфера деятельности" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="overflow-auto h-[300px]">
                                <SelectLabel>Сфера деятельности</SelectLabel>
                                {Options.map((option) => (
                                  <SelectItem
                                    key={option.id}
                                    value={option.name}
                                  >
                                    {option.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <div className="mt-5 flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={editHandleGeneral}>
                          Отмена
                        </Button>
                        <Button variant="black" type="submit">
                          Сохранить
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center pt-12">
                      <Image
                        src={
                          data.project.data.logo?.url
                            ? `/api/${data.project.data.logo.url}`
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
                    {data.isAuthor && (
                      <div className="col-span-2">
                        <div className="flex justify-end gap-6 mt-4">
                          <Button
                            variant="outline"
                            color="zinc"
                            onClick={editHandleGeneral}
                          >
                            <Pen className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <Separator className="mb-6 mt-3" />
                <div className="grid gap-3">
                  {data.project.data.business_plan?.url && (
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

                          {editBusinessPlan ? (
                            <form>
                              <Input
                                type="file"
                                onChange={handleBusinessPlanChange}
                              />
                              <div className="mt-5 flex justify-end gap-3 pt-4">
                                <Button
                                  variant="outline"
                                  onClick={editHandleBusinessPlan}
                                >
                                  Отмена
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <Link
                                href={
                                  data.project.data.business_plan.url
                                    ? `/api/${data.project.data.business_plan.url}`
                                    : Test
                                }
                              >
                                <div className=" flex w-auto flex-col items-center justify-center rounded-lg border-[1px] bg-white py-8 font-semibold hover:border-slate-700">
                                  <DownloadSimple className="h-14 w-14" />
                                  <p className="mt-3 text-center text-base sm:text-xl ">
                                    {data.project.data.title}
                                  </p>
                                </div>
                              </Link>
                              {data.isAuthor && (
                                <div className="col-span-2">
                                  <div className="flex justify-end gap-6 mt-4">
                                    <Button
                                      variant="outline"
                                      color="zinc"
                                      onClick={editHandleBusinessPlan}
                                    >
                                      <Pen className="h-6 w-6" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  )}

                  {data.project.data.logo?.url && (
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
                      getImageSrc(data.project.data.logo.url)

                                ?? Test
                            }
                            alt="test"
                          />
                          <p className="mt-3 text-center text-base sm:text-xl ">
                            {data.project.data.title}
                          </p>
                        </div>
                        <Separator className="my-7" />
                        {data.project.data.video_introduction?.url && (
                          <div>
                            <p className=" text-lg font-semibold">Видео</p>

                            {editVideo ? (
                              <form className="mt-5">
                                <Input
                                  type="file"
                                  onChange={handleVideoChange}
                                />
                                <div className="mt-5 flex justify-end gap-3 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={editHandleVideo}
                                  >
                                    Отмена
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="m-auto mt-16 grid">
                                  <Link
                                    href={
                                      data.project.data.video_introduction.url
                                        ? `/api/${data.project.data.video_introduction.url}`
                                        : Test
                                    }
                                  >
                                    <div className=" flex w-auto flex-col items-center justify-center rounded-lg border-[1px] bg-white py-8 font-semibold hover:border-slate-700">
                                      <DownloadSimple className="h-14 w-14" />
                                      <p className="mt-3 text-center text-base sm:text-xl ">
                                        {data.project.data.title} Видео
                                      </p>
                                    </div>
                                  </Link>
                                </div>
                                {data.isAuthor && (
                                  <div className="col-span-2">
                                    <div className="flex justify-end gap-6 mt-4">
                                      <Button
                                        variant="outline"
                                        color="zinc"
                                        onClick={editHandleVideo}
                                      >
                                        <Pen className="h-6 w-6" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                            <div />
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                  )}

                  {/* <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleClick}
                  >
                    <div className="flex w-full items-center gap-3 text-sm font-semibold">
                      <Chat className="w-6 h-6" /> Обсуждение проекта
                    </div>
                    <ArrowRight className="w-6 h-6" />
                  </Button> */}
                </div>
                <div />
              </div>
            </div>

            <div className="rounded-lg border bg-white sm:col-span-7 mb-4">
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
                    <>
                      {editProjectAbout ? (
                        <form onSubmit={handleAbout(onSubmitAbout)}>
                          <div className="flex flex-col gap-3">
                            <p className=" text-xl font-semibold text-slate-400">
                              О проекте
                            </p>
                            <TextArea
                              {...registerAbout("description")}
                              className="text-sm"
                            >
                              {data.project.data.description}
                            </TextArea>
                          </div>
                          <div className="mt-5 flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={editHandleAbout}>
                              Отмена
                            </Button>
                            <Button variant="black" type="submit">
                              Сохранить
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex flex-col gap-3">
                            <p className=" text-xl font-semibold text-slate-400">
                              О проекте
                            </p>
                            <p className="text-sm">
                              {data.project.data.description}
                            </p>
                          </div>
                          {data.isAuthor && (
                            <div className="col-span-2">
                              <div className="flex justify-end gap-6 mt-4">
                                <Button
                                  variant="outline"
                                  color="zinc"
                                  onClick={editHandleAbout}
                                >
                                  <Pen className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  </TabsContent>

                  {/* resource */}

                  <TabsContent className="border-none" value="resource">
                    <>
                      {editProjectResources ? (
                        <form onSubmit={handleResources(onSubmitAbout)}>
                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                              <p className=" text-xl font-semibold text-slate-400">
                                Материальные ресурсы проекта
                              </p>
                              <TextArea
                                {...registerResources(
                                  "owned_material_resources"
                                )}
                              >
                                {data.project.data.owned_intellectual_resources}
                              </TextArea>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-3">
                              <p className=" text-xl font-semibold text-slate-400">
                                Требуемые материальные ресурсы проекту
                              </p>
                              <TextArea
                                {...registerResources(
                                  "required_material_resources"
                                )}
                              >
                                {data.project.data.required_material_resources}
                              </TextArea>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-3">
                              <p className=" text-xl font-semibold text-slate-400">
                                Интеллектуальные ресурсы проекта
                              </p>
                              <TextArea
                                {...registerResources(
                                  "owned_intellectual_resources"
                                )}
                              >
                                {data.project.data.owned_intellectual_resources}
                              </TextArea>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-3">
                              <p className=" text-xl font-semibold text-slate-400">
                                Требуемые интеллектуальные ресурсы проекту
                              </p>
                              <TextArea
                                {...registerResources(
                                  "required_intellectual_resources"
                                )}
                              >
                                {
                                  data.project.data
                                    .required_intellectual_resources
                                }
                              </TextArea>
                            </div>
                          </div>
                          <div className="mt-5 flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={editHandleAbout}>
                              Отмена
                            </Button>
                            <Button variant="black" type="submit">
                              Сохранить
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
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
                          {data.isAuthor && (
                            <div className="col-span-2">
                              <div className="flex justify-end gap-6 mt-4">
                                <Button
                                  variant="outline"
                                  color="zinc"
                                  onClick={editHandleResources}
                                >
                                  <Pen className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  </TabsContent>

                  {/* profitability */}
                  <div className="m-auto flex w-auto justify-center">
                    <TabsContent
                      className=" h-[500px] w-[900px] border-none"
                      value="profitability"
                    >
                      {editProjectROI ? (
                        <form onSubmit={handleROI(onSubmitAbout)}>
                          <div className="flex flex-col gap-3">
                            <p className=" text-xl font-semibold text-slate-400">
                              Ожидаемая рентабельность по проекту
                            </p>
                            <TextArea {...registerROI("profitability")}>
                              {data.project.data.profitability}
                            </TextArea>
                          </div>
                          <div className="mt-5 flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={editHandleROI}>
                              Отмена
                            </Button>
                            <Button variant="black" type="submit">
                              Сохранить
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex flex-col gap-3">
                            <p className=" text-xl font-semibold text-slate-400">
                              Ожидаемая рентабельность по проекту
                            </p>
                            <p className="text-sm">
                              {data.project.data.profitability}
                            </p>
                          </div>
                          {data.isAuthor && (
                            <div className="col-span-2">
                              <div className="flex justify-end gap-6 mt-4">
                                <Button
                                  variant="outline"
                                  color="zinc"
                                  onClick={editHandleROI}
                                >
                                  <Pen className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
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
                            {pendingMembers?.map((member) => (
                              <div key={member.id}>
                                <p>{member.application_message}</p>
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
                        className={`mt-2 max-w-96 rounded-lg px-2 py-1 ${
                          isTrue ? "bg-lime-400 " : "flex items-end gap-3"
                        }`}
                      >
                        <Image
                          src={Test}
                          width={34}
                          className={` ${isTrue ? "hidden" : ""} rounded-full`}
                          alt="test"
                        />
                        <div
                          className={`mt-2 rounded-lg px-2 py-1 ${
                            isTrue
                              ? "bg-lime-400"
                              : "grid max-max-w-96 items-end justify-end gap-3 border bg-slate-50"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              isTrue ? "hidden" : ""
                            }`}
                          >
                            Ахметов Темирлан
                          </p>
                          <>
                            <p className="text-sm">test message</p>
                          </>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`my-1 flex flex-col ${
                        isTrue ? "items-end self-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`mt-2 max-w-96 rounded-lg px-2 py-1 ${
                          isTrue ? "bg-lime-400 " : "flex items-end gap-3"
                        }`}
                      >
                        <Image
                          src={Test}
                          width={34}
                          className={` ${isTrue ? "hidden" : ""} rounded-full`}
                          alt="test"
                        />
                        <div
                          className={`mt-2 rounded-lg px-2 py-1 ${
                            isTrue
                              ? "bg-lime-400"
                              : "grid max-max-w-96 items-end justify-end gap-3 border bg-slate-50"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              isTrue ? "hidden" : ""
                            }`}
                          >
                            Ахметов Темирлан
                          </p>
                          <>
                            <p className="text-sm">test message</p>
                          </>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`my-1 flex flex-col ${
                        isTrue ? "" : "items-end self-end"
                      }`}
                    >
                      <div
                        className={`mt-2 max-w-96 rounded-lg px-2 py-1 ${
                          isTrue ? "bg-lime-400 " : "flex items-end gap-3"
                        }`}
                      >
                        <div
                          className={`mt-2 rounded-lg px-2 py-1 ${
                            isTrue
                              ? "bg-lime-400"
                              : "grid max-max-w-96 items-end justify-end gap-3 border bg-slate-50"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              isTrue ? "hidden" : ""
                            }`}
                          >
                            Ахметов Темирлан
                          </p>
                          <>
                            <p className="text-sm">test message</p>
                          </>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`my-1 flex flex-col ${
                        isTrue ? "items-end self-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`mt-2 max-w-96 rounded-lg px-2 py-1 ${
                          isTrue ? "bg-lime-400 " : "flex items-end gap-3"
                        }`}
                      >
                        <Image
                          src={Test}
                          width={34}
                          className={` ${isTrue ? "hidden" : ""} rounded-full`}
                          alt="test"
                        />
                        <div
                          className={`mt-2 rounded-lg px-2 py-1 ${
                            isTrue
                              ? "bg-lime-400"
                              : "grid max-max-w-96 items-end justify-end gap-3 border bg-slate-50"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              isTrue ? "hidden" : ""
                            }`}
                          >
                            Ахметов Темирлан
                          </p>
                          <>
                            <p className="text-sm">test message</p>
                          </>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`my-1 flex flex-col ${
                        isTrue ? "items-end self-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`mt-2 max-w-96 rounded-lg px-2 py-1 ${
                          isTrue ? "bg-lime-400 " : "flex items-end gap-3"
                        }`}
                      >
                        <Image
                          src={Test}
                          width={34}
                          className={` ${isTrue ? "hidden" : ""} rounded-full`}
                          alt="test"
                        />
                        <div
                          className={`mt-2 rounded-lg px-2 py-1 ${
                            isTrue
                              ? "bg-lime-400"
                              : "grid max-max-w-96 items-end justify-end gap-3 border bg-slate-50"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              isTrue ? "hidden" : ""
                            }`}
                          >
                            Ахметов Темирлан
                          </p>
                          <>
                            <p className="text-sm">test message</p>
                          </>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`my-1 flex flex-col ${
                        isTrue ? "" : "items-end self-end"
                      }`}
                    >
                      <div
                        className={`mt-2 max-w-96 rounded-lg px-2 py-1 ${
                          isTrue ? "bg-lime-400 " : "flex items-end gap-3"
                        }`}
                      >
                        <div
                          className={`mt-2 rounded-lg px-2 py-1 ${
                            isTrue
                              ? "bg-lime-400"
                              : "grid max-max-w-96 items-end justify-end gap-3 border bg-slate-50"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              isTrue ? "hidden" : ""
                            }`}
                          >
                            Ахметов Темирлан
                          </p>
                          <>
                            <p className="text-sm">test message</p>
                          </>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="flex items-center justify-around px-6 pb-3 gap-2">
                    <TextArea placeholder="Сообщение" className="max-h-11" />
                    <Button
                      variant="outline"
                      className="bg-slate-100 rounded-full"
                    >
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
