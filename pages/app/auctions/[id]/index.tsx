import {
  Lightbulb,
  MaskHappy,
  Medal,
  ShieldWarning,
  Sun,
} from "@phosphor-icons/react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { GetStaticPropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Entity } from "../../../../../api/tender-bid";
import api from "../../../../api";
import { TenderBids } from "../../../../components/bids/bidSheet";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/primitives/dialog";
import { Thumb } from "../../../../components/primitives/embla-thumbs";
import { Field, Form } from "../../../../components/primitives/form";
import { Input } from "../../../../components/primitives/input";
import { Label } from "../../../../components/primitives/label";
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
import { TextArea } from "../../../../components/primitives/text-area";

const calcTime = (date: string) => {
  const now = new Date();

  const finish = new Date(date);

  const diff = finish.getTime() - now.getTime();

  const hours = Math.floor(diff / 1000 / 60 / 60);

  return hours > 0 ? hours : 0;
};

export const getServerSideProps = async (
  context: GetStaticPropsContext<{
    id: string;
  }>
) => {
  const { data } = await api.tenders.show(Number(context.params!.id));

  const { data: files } = await api.tenders
    .files(Number(context.params!.id))
    .index({ page: 1, perPage: 100 });

  if (!data) {
    return {
      notFound: true,
    };
  }
  const { data: profile } = await api.profiles.show(data!.profileId);
  const { data: user } = await api.users.show(profile!.userId);

  const imagesArray = files?.filter(
    (obj) => obj.mimeType === "image/png" || obj.mimeType === "image/jpeg"
  );

  return {
    props: {
      data: {
        ...data!,
        user: user!,
        profile: profile!,
        files: files!,
        images: imagesArray!,
      },
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Tender({ data }: Props) {
  const OPTIONS: EmblaOptionsType = { align: "center", loop: true };
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(OPTIONS);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const router = useRouter();

  return (
    <>
      <Navigation />
      <main className="min-h-[90vh] bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Аукционы / Продажи / </span>
            {data.title}
          </h1>

          <div className="">
            {data.verifiedAt ? (
              ""
            ) : (
              <div className="flex gap-2 justify-center py-4 bg-lime-300  rounded-md my-4 font-bold text-base">
                <ShieldWarning className="w-6 h-6" /> Объявление на рассмотрении
                y модератора: 1 день
              </div>
            )}

            <div className="p-10 bg-white">
              <div className="grid grid-cols-10 gap-8  mt-2 rounded-md">
                <div className="col-span-4">
                  <div className="embla">
                    <div
                      className=" overflow-hidden rounded-md"
                      ref={emblaMainRef}
                    >
                      <div className="flex flex-row h-auto ml-[-1rem] ">
                        {data.images.map((image) => (
                          <div
                            key={image.id}
                            className="overflow-hidden flex-[0_0_100%] min-w-0 relative "
                          >
                            <Image
                              className="h-[19rem] w-full object-cover"
                              src={image.url}
                              width={0}
                              height={0}
                              unoptimized
                              alt="Your alt text"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-[1.6rem]">
                      <div className="overflow-hidden" ref={emblaThumbsRef}>
                        <div className="flex flex-row ml-[-1rem]">
                          {data.images.map((image, index) => (
                            <Thumb
                              key={index}
                              onClick={() => onThumbClick(index)}
                              selected={index === selectedIndex}
                              index={index}
                              imgSrc={image.url}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-100 mt-3 rounded-md p-3 flex flex-col gap-2">
                    <p className=" font-medium">Продавец</p>
                    <Link href={"/app/profiles/" + data.profileId}>
                      <div className="flex items-center gap-5">
                        <Image
                          width={0}
                          height={0}
                          unoptimized
                          className="w-10 h-10 object-cover rounded-md"
                          alt="alte test"
                          src={data.user.file.url}
                        />
                        <p className=" font-semibold">
                          {data.user.firstName} {data.user.lastName}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="col-span-6">
                  <p className=" text-3xl font-semibold">{data.title}</p>

                  <div className="grid grid-cols-4 gap-4 mt-7">
                    <div className="bg-slate-100 p-3 rounded-md">
                      <div className="flex justify-end">
                        <Lightbulb className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-medium text-lg mt-4">Прием ставок</p>
                      <p className="text-sm text-slate-500 font-medium">
                        Cтатус
                      </p>
                    </div>

                    <div className="bg-slate-100 p-3 rounded-md">
                      <div className="flex justify-end">
                        <Medal className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className=" font-medium text-lg mt-4">
                        {data.duration} часа(ов)
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        Длительность
                      </p>
                    </div>

                    <div className="bg-slate-100 col-span-2 rounded-md p-3">
                      <div>
                        <p className="text-slate-500 font-medium">
                          Стартовая цена
                        </p>
                        <p className=" font-semibold text-2xl mt-2">
                          {data.startingPrice} тенге
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-100 p-3 rounded-md">
                      <div className="flex justify-end">
                        <MaskHappy className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className=" font-medium text-lg mt-4">25.06.2023</p>
                      <p className="text-sm text-slate-500 font-medium">
                        Начало аукциона
                      </p>
                    </div>

                    <TenderBids />

                    <div className="bg-slate-100 col-span-2 rounded-md p-3">
                      <div>
                        <p className="text-slate-500 font-medium">
                          Цена мгновенной продажи
                        </p>
                        <p className=" font-semibold text-2xl mt-2">
                          {data.startingPrice} тенге
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-xl mt-11">Описание</p>
                    <p className="mt-3">{data.description}</p>
                  </div>
                </div>
              </div>
              <Separator className="my-10" />
              {data.verifiedAt ? (
                <div className=" flex justify-center gap-3">
                  <Button variant="outline" className="w-3/12">
                    Купить за 100 000
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="black" className="w-3/12">
                        Сделать ставку
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[725px]">
                      <DialogHeader>
                        <DialogTitle>Сделайте ставку</DialogTitle>
                        <DialogDescription className="text-xs">
                          Вы сможете в любое время повысить свою ставку. Другие
                          участники будут видеть указанную вами цену
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <p className="font-semibold">Стартовая цена</p>
                        <p className="bg-slate-100 text-2xl font-semibold p-4 rounded-md w-fit">
                          {data.startingPrice}
                        </p>

                        <Form
                          onSubmit={async (event) => {
                            event.preventDefault();

                            const form = new FormData(event.currentTarget);
                            const values = Object.fromEntries(
                              form.entries()
                            ) as unknown as {
                              price: number;
                            };

                            const profileId = Number(
                              localStorage.getItem("profileId")
                            );

                            await api.tenders
                              .bids(data.id)
                              .store({ price: values.price, profileId });
                          }}
                          action=""
                          className="flex flex-col gap-3"
                        >
                          <p>Ваша ставка</p>
                          <div className="flex items-center gap-6">
                            <Field name="price">
                              <Label>Сумма</Label>
                              <Input placeholder="KZT" type="number" min={1} />
                            </Field>
                            <p className="text-xs">
                              Ваша ставка должна быть выше стартовый цены
                            </p>
                          </div>
                          {/* <p>Комментарий</p>
                          <TextArea /> */}
                          <DialogFooter className=" justify-center">
                            <Button variant="outline" className="w-3/4">
                              Отмета
                            </Button>
                            <Button
                              variant="black"
                              type="submit"
                              className="w-3/4"
                            >
                              Отправить
                            </Button>
                          </DialogFooter>
                        </Form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className=" flex justify-center gap-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-3/12" variant="outline">
                        Удалить Объявление
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить объявление?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Восстановить удаленное объявление будет невозможно
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction className="w-[90px] bg-rose-600 hover:bg-red-900">
                          Да
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="black" className="w-3/12">
                    Ускорить модерацию (3 часа)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
