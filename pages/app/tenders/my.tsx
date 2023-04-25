import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { Paperclip } from "@phosphor-icons/react";
import { Uppy } from "@uppy/core";
import UppyForm from "@uppy/form";
import Russian from "@uppy/locales/lib/ru_RU";
import { Dashboard, DashboardModal } from "@uppy/react";
import Url from "@uppy/url";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import api from "../../../api";
import { buildFormData } from "../../../api/tender-file";
import { Entity } from "../../../api/tenders";
import { Navigation } from "../../../components/Navigation";
import { Button } from "../../../components/Primitives/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/Primitives/Card";
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
  Textarea,
} from "../../../components/Primitives/Form";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const calcTime = (date: string) => {
  const now = new Date();

  const finish = new Date(date);

  const diff = finish.getTime() - now.getTime();

  const hours = Math.floor(diff / 1000 / 60 / 60);

  return hours > 0 ? hours : 0;
};

const tabs = [
  { name: "Все тендеры", href: "/app/tenders", current: false },
  { name: "Мои тендеры", href: "/app/tenders/my", current: true },
];

const uppy = new Uppy({
  locale: Russian,
  restrictions: {
    allowedFileTypes: [
      ".jpg",
      ".jpeg",
      ".png",
      ".pdf",
      ".docx",
      ".doc",
      ".pptx",
      ".ppt",
      ".xlsx",
      ".xls",
    ],
    maxFileSize: 1024 * 1024 * 8,
  },
});

export default function TendersMy({ data }: Props) {
  const router = useRouter();
  const [fileDashboardOpen, setFileDashboardOpen] = useState(false);

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  useEffect(() => {
    uppy.on("dashboard:modal-closed", () => setFileDashboardOpen(false));
  }, []);

  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    uppy.on("file-added", () => setFileCount(uppy.getFiles().length));
    uppy.on("file-removed", () => setFileCount(uppy.getFiles().length));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const values = Object.fromEntries(form.entries()) as unknown as {
      title: string;
      description: string;
      duration: number;
      startingPrice?: number;
    };

    const profileId = localStorage.getItem("portfolioId");

    if (!profileId) {
      // eslint-disable-next-line no-alert
      alert("Необходимо создать профиль");
      return;
    }

    const { data } = await api.tenders.store({
      title: values.title,
      description: values.description,
      duration: values.duration,
      profileId: Number.parseInt(profileId, 10),
      startingPrice: values.startingPrice,
    });

    if (data) {
      const files = uppy.getFiles().map((file) => {
        const formData = buildFormData(file.data);

        return api.tenders.files(data.id).store(formData);
      });

      const t = await Promise.allSettled(files);

      router.push(`/app/tenders/${data.id}`);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 py-8">
          <p className=" text-sm text-slate-300">Мои тендеры</p>
          <div className="my-5 flex flex-col items-end justify-end gap-4 md:mb-12 md:flex-row md:items-center  md:justify-between">
            <div>
              <div className="sm:hidden">
                <select
                  onChange={handleSelectChange}
                  id="tabs"
                  name="tabs"
                  className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
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
                      className={clsx(
                        tab.current
                          ? "bg-lime-100 text-lime-700"
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
            <Dialog
              onOpenChange={(open) => {
                if (!open) {
                  uppy.getFiles().forEach((file) => {
                    uppy.removeFile(file.id);
                  });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>Создать тендер</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать тендер</DialogTitle>
                  <DialogDescription>
                    Заполните форму, чтобы создать тендер.
                  </DialogDescription>
                </DialogHeader>
                <Form onSubmit={onSubmit} id="form">
                  <Field name="title">
                    <Label>Название</Label>
                    <Input required minLength={1} maxLength={255} />
                  </Field>
                  <Field name="description">
                    <Label>Описание</Label>
                    <Textarea required minLength={1} maxLength={1024} />
                  </Field>
                  <Field name="duration">
                    <Label>Длительность (в часах)</Label>
                    <Input
                      type="number"
                      required
                      min={24}
                      max={720}
                      defaultValue={24}
                    />
                  </Field>
                  <Field name="startingPrice">
                    <Label>Стартовая цена</Label>
                    <Input
                      type="number"
                      placeholder="Опционально"
                      required
                      min={1}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="outline"
                    className="space-x-2"
                    onClick={() => setFileDashboardOpen(true)}
                  >
                    <Paperclip
                      weight="bold"
                      className="h-4 w-4 text-zinc-800"
                    />
                    <span>Прикрепление файлов</span>
                    <span className="font-semibold">
                      {fileCount > 0 && `${fileCount} выбран(о)`}
                    </span>
                  </Button>
                  <DashboardModal
                    proudlyDisplayPoweredByUppy={false}
                    hideUploadButton
                    open={fileDashboardOpen}
                    uppy={uppy}
                  />
                  <DialogFooter>
                    <Button type="submit" className="rounded-lg">
                      Создать профиль
                    </Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.map((tender) => (
              <Card
                key={tender.id}
                onClick={() => {
                  router.push(`/app/tenders/${tender.id}`);
                }}
                className="cursor-pointer"
              >
                <CardHeader>
                  <CardTitle>
                    #{tender.id} {tender.title}
                  </CardTitle>
                  <CardDescription>{tender.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-sm font-medium">
                      <span>Статус:</span>
                      <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                        {tender.finishedAt &&
                          new Date(tender.finishedAt).getTime() > Date.now() &&
                          "Идет"}
                        {!tender.finishedAt && "На модерации"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-sm font-medium">
                      <span>Осталось часов:</span>
                      <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                        {tender.finishedAt
                          ? calcTime(tender.finishedAt)
                          : "---"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-sm font-medium">
                      <span>Стартовая сумма:</span>
                      <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-500">
                        {tender.startingPrice
                          ? new Intl.NumberFormat("kz-KZ", {
                              style: "currency",
                              currency: "KZT",
                            }).format(tender.startingPrice)
                          : "---"}{" "}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await api.session.show({
    headers: {
      Cookie: context.req.headers.cookie!,
    },
    credentials: "include",
  });

  const profiles = await api.profiles.index({
    page: 1,
    perPage: 100,
    filters: {
      userId: session.data!.id,
    },
  });

  const tndrs = profiles.data!.map((profile) =>
    api.tenders
      .index({
        page: 1,
        perPage: 100,
        filters: {
          profileId: profile.id,
        },
      })
      .then((tenders) => tenders.data)
  );

  const tenders = await Promise.all(tndrs);

  const flat = tenders.flat().filter(Boolean) as Entity[];

  return {
    props: {
      data: flat,
    },
  };
}
