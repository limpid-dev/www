import {
  ArrowLeft,
  ArrowRight,
  Chat,
  DotsThreeVertical,
  DownloadSimple,
  Envelope,
  Files,
  FileVideo,
  Paperclip,
  Pen,
  Trash,
  User,
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
import { components, paths } from "../../../../api/api-paths";
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
import getImageSrc from "../../../../hooks/get-image-url";
import Test from "../../../../images/avatars/defaultProfile.svg";
import SentImage from "../../../../images/email 1.png";
import noProfiles from "../../../../images/noProfiles.svg";

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
    const userId = session.data.id;
    try {
      const { data: members } = await api.getProjectMembers(
        Number.parseInt(context!.params!.id as string, 10),
        {
          page: 1,
          per_page: 10,
        },
        {
          headers: {
            Cookie: context.req.headers.cookie,
          },
        }
      );
      const pendingMembers = members.data?.filter(
        (member) => member.status === "pending"
      );

      const acceptedMembers = members.data?.filter(
        (member) => member.status === "accepted"
      );

      const isMember = members.data?.some(
        (member) =>
          member.status === "accepted" && member.profile_id === profile.data.id
      );

      console.log(isMember);

      return {
        props: {
          data: {
            project: project!,
            isAuthor: isAuthor!,
            userId: userId!,
            members: acceptedMembers!,
            pendingMembers: pendingMembers!,
            isMember: isMember!,
          },
        },
      };
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return {
          props: {
            data: {
              userId: userId!,
              project: project!,
              isAuthor: isAuthor!,
            },
          },
        };
      }
      console.error("Error fetching project members:", error);
    }
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProjectView({ data }: Props) {
  const [isShown, setIsShown] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [sent, setSent] = useState(false);
  const parsedId = Number.parseInt(id as string, 10) as number;
  const [largeScreen, setLargeScreen] = useState(false);
  const inputRef = useRef(null);
  const [error, setErrors] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: chatMessages } = await api.getMessages({
          path: { chat_id: data.project.data.chat_id },
          query: {
            page: 1,
            per_page: 1000,
          },
        });
        if (chatMessages.data.length > 0) {
          setMessages(chatMessages.data);
        }
      } catch (error) {
        console.error("Error getting messages:", error);
      }
    };

    const intervalId = setInterval(fetchMessages, 1000);
    return () => clearInterval(intervalId);
  }, [data.project.data.chat_id]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await api.addProjectMember({ project_id: parsedId }, data);
      setSent(true);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError("application_message", {
          type: "custom",
          message: "Дождитесь ответа от создателя проекта",
        });
      } else {
        console.error("Error adding project member:", error);
      }
    }
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

  const onSubmitProject = async (aboutFormData: any) => {
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

  const handleMemberAccept = async (project_id: number, member_id: number) => {
    try {
      await api.acceptProjectMember(project_id, member_id);
      await router.reload();
    } catch (error) {
      console.error("Error adding project member:", error);
    }
  };

  const handleMemberReject = async (project_id: number, member_id: number) => {
    try {
      await api.rejectProjectMember(project_id, member_id);
      await router.reload();
    } catch (error) {
      console.error("Error adding project member:", error);
    }
  };

  const handleDeleteMember = async (project_id: number, member_id: number) => {
    try {
      await api.deleteProjectMember(project_id, member_id);
      await router.reload();
    } catch (error) {
      console.error("Error deleting project member:", error);
    }
  };

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
        setErrors("Размер не более 1 МБ");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    try {
      await api.sendMessage(parsedId, message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
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

          <div className="my-4 flex flex-col items-end justify-end gap-4 sm:mb-0 md:mb-5 md:flex-row md:items-baseline md:justify-end">
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
                {data.isMember ? (
                  ""
                ) : (
                  <Dialog>
                    <DialogTrigger className="rounded-md bg-black p-2 text-sm text-white hover:bg-slate-700">
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
                          {errors.application_message && (
                            <p className="text-center text-red-500">
                              {errors.application_message.message}
                            </p>
                          )}
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>

          <div className="grid min-h-[650px] grid-cols-1 gap-6 sm:grid-cols-10">
            <div className="rounded-lg border sm:col-span-3">
              <div className="h-full bg-white p-6">
                {editGeneral ? (
                  <div className="flex flex-col items-center gap-x-8 bg-white pt-5">
                    <Image
                      src={getImageSrc(data.project.data.logo.url) ?? Test}
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
                      onSubmit={handleGeneral(onSubmitProject)}
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
                      <div className="mt-3 flex justify-end gap-3">
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
                        src={getImageSrc(data.project.data.logo?.url) ?? Test}
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
                                  getImageSrc(data.project.data.logo?.url) ??
                                  Test
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
                              getImageSrc(data.project.data.logo.url) ?? Test
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
                                      getImageSrc(
                                        data.project.data.video_introduction.url
                                      ) ?? Test
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

                  {data.isAuthor ? (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" className="w-full">
                          <div className="flex w-full items-center gap-3 text-sm font-semibold">
                            <Envelope className="w-6 h-6" /> Заявки на участие
                          </div>
                          <ArrowRight className="w-6 h-6" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        position="right"
                        size={largeScreen ? "sm" : "full"}
                      >
                        <SheetHeader>
                          <SheetTitle>Заявки</SheetTitle>
                        </SheetHeader>
                        <div className="flex w-auto flex-col rounded-lg bg-white py-8">
                          {data.pendingMembers?.map((member) => (
                            <div key={member.id}>
                              <Link
                                href={`/app/profiles/${member.profile_id}/`}
                              >
                                <div className="grid items-center justify-center gap-4 rounded-lg border border-b-1 hover:border-lime-400 py-6 pl-6 pr-4 sm:grid-cols-10">
                                  <div className="col-span-4">
                                    <Image
                                      src={
                                        getImageSrc(
                                          member.profile?.avatar?.url
                                        ) ?? Test
                                      }
                                      width={0}
                                      height={0}
                                      unoptimized
                                      className="rounded-md object-cover bg-slate-100 w-auto h-auto"
                                      alt="test"
                                    />
                                  </div>
                                  <div className="col-span-6">
                                    <div className="flex flex-col gap-1">
                                      <h1 className="font-bold">
                                        {member?.profile?.display_name}
                                      </h1>
                                      <p className="text-xs">
                                        {member?.profile?.industry}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="col-span-10 bg-slate-100 p-2 rounded-md text-sm">
                                    {member.application_message}
                                  </p>
                                </div>
                              </Link>
                              <div className="flex justify-end gap-3 my-3">
                                <Button
                                  onClick={() =>
                                    handleMemberReject(
                                      member.project_id,
                                      member.id
                                    )
                                  }
                                  variant="outline"
                                >
                                  Отклонить
                                </Button>
                                <Button
                                  variant="black"
                                  onClick={() =>
                                    handleMemberAccept(
                                      member.project_id,
                                      member.id
                                    )
                                  }
                                >
                                  Принять
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                  ) : (
                    ""
                  )}
                  {data.isMember || data.isAuthor ? (
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
                  ) : (
                    ""
                  )}
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
                    <>
                      {editProjectAbout ? (
                        <form onSubmit={handleAbout(onSubmitProject)}>
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
                        <form onSubmit={handleResources(onSubmitProject)}>
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
                                className=""
                                {...registerResources(
                                  "required_intellectual_resources"
                                )}
                                defaultValue={
                                  data.project.data
                                    .required_intellectual_resources
                                }
                              />
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
                                {
                                  data.project.data
                                    .required_intellectual_resources
                                }
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
                        <form onSubmit={handleROI(onSubmitProject)}>
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
                          <DialogContent className="px-20 py-12 max-w-[825px]">
                            <DialogHeader className="items-center">
                              <DialogTitle>Участники Обсуждения</DialogTitle>
                            </DialogHeader>

                            {data.members && data.members.length > 0 ? (
                              <div className="grid sm:grid-cols-2 gap-6 max-h-[650px] overflow-y-scroll">
                                {data.members?.map((member) => (
                                  <div
                                    key={member.id}
                                    className="grid gap-4 rounded-lg border py-6 pl-6 pr-4 sm:grid-cols-10"
                                  >
                                    <div className="sm:col-span-4">
                                      <Image
                                        src={
                                          getImageSrc(
                                            member?.profile?.avatar?.url
                                          ) ?? Test
                                        }
                                        width={0}
                                        height={0}
                                        unoptimized
                                        className="rounded-md m-auto object-cover bg-slate-100 h-[106px] w-auto"
                                        alt="test"
                                      />
                                    </div>
                                    <div className="sm:col-span-6">
                                      <div className="flex flex-col gap-2">
                                        <h1 className="font-bold">
                                          {member.profile?.display_name}
                                        </h1>
                                        <p className="text-xs">
                                          {member.profile?.industry}
                                        </p>
                                        <Link
                                          href={`/app/profiles/${member.profile_id}/`}
                                        >
                                          <Button
                                            variant="subtle"
                                            className="w-full"
                                          >
                                            <User className="h-4 w-4" />
                                            <span className="ml-2 text-xs">
                                              Профиль
                                            </span>
                                          </Button>
                                        </Link>
                                        {data.isAuthor && (
                                          <Button
                                            variant="subtle"
                                            onClick={() =>
                                              handleDeleteMember(
                                                member.project_id,
                                                member.id
                                              )
                                            }
                                          >
                                            <Trash />
                                            <span className="ml-2 text-xs">
                                              Удалить участника
                                            </span>
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="grid gap-6 max-h-[650px] overflow-y-scroll">
                                <Image
                                  src={noProfiles}
                                  className="m-auto"
                                  alt="text"
                                />
                                <p className="text-center mt-3 font-medium">
                                  У вас нет участников
                                </p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <ScrollArea className="h-[530px] overflow-y-scroll">
                    {messages.map((message) => {
                      if (message.user_id === data.userId) {
                        return (
                          <div
                            key={message.id}
                            className="my-1 flex flex-col items-end self-end"
                          >
                            <div className="mt-2 mr-2 rounded-lg p-2 bg-lime-300 grid items-end justify-end gap-3 max-w-md">
                              <p className="text-sm">{message.message}</p>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={message.id}
                          className="my-1 flex flex-col items-start self-start"
                        >
                          <div className="mt-2 ml-2 rounded-lg p-2 bg-slate-100 grid items-start justify-start gap-2 max-w-md">
                            <p className="font-medium text-sm">
                              {message.user.first_name} {message.user.last_name}
                            </p>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </ScrollArea>
                  <div className="flex items-center justify-around px-6 pb-3 gap-2">
                    <Input
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      placeholder="Сообщение"
                      className="max-h-11"
                    />
                    <Button
                      variant="outline"
                      type="submit"
                      onClick={handleSendMessage}
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
