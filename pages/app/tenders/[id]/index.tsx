import {
  CoinVertical,
  FileArrowDown,
  Lightbulb,
  MaskHappy,
  Medal,
  ShieldWarning,
  Spinner,
  Sun,
} from "@phosphor-icons/react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
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
  DialogClose,
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
import getImageSrc from "../../../../hooks/get-image-url";

const calcTime = (date: string) => {
  const now = new Date();

  const finish = new Date(date);

  const diff = finish.getTime() - now.getTime();

  const hours = Math.floor(diff / 1000 / 60 / 60);

  return hours > 0 ? hours : 0;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{
    id: string;
  }>
) => {
  const { data: tender } = await api.getTender(Number(context.params!.id));
  const { data: user } = await api.getUser({
    headers: {
      Cookie: context.req.headers.cookie,
    },
  });
  const isAuthor = tender.data?.profile_id === user.data.selected_profile_id;

  console.log(tender.data);
  return {
    props: {
      data: {
        ...tender.data!,
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
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <h1 className="text-sm">
            <span className="text-slate-300">Аукционы / Закупки / </span>
            {data.title}
          </h1>

          <div className="">
            {data.verified_at ? (
              ""
            ) : (
              <div className="flex gap-2 justify-center py-4 bg-lime-300  rounded-md my-4 font-bold text-base">
                <ShieldWarning className="w-6 h-6" /> Объявление на рассмотрении
                y модератора: 1 день
              </div>
            )}

            <div className="p-10 mt-20 bg-white">
              <div className=" m-auto max-w-5xl rounded-md bg-white p-5 ">
                <p className="text-slate-400">#{data.id}</p>
                <div className="m-auto max-w-3xl">
                  <h1 className="text-center text-3xl font-semibold">
                    {data.title}
                  </h1>
                  <h1 className="mb-7 mt-3 text-center text-base font-medium text-slate-300">
                    {/* профиль название профессии */}
                  </h1>
                  <div className=" grid grid-cols-2 justify-around gap-4 p-3 sm:grid-cols-4">
                    <div className="max-w-[160px] rounded-md bg-slate-100 p-3">
                      <div className="flex justify-end ">
                        <Spinner className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">
                          {data.purchase_type}
                        </p>
                        <p className="text-xs">Вид</p>
                      </div>
                    </div>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={getImageSrc(data.technical_specification?.url)}
                    >
                      <div className="max-w-[160px] rounded-md bg-lime-100 p-3 border-2 hover:border-lime-300">
                        <div className="flex justify-end ">
                          <FileArrowDown className="w-6 h-6 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">Документ</p>
                          <p className="text-xs"> Посмотреть</p>
                        </div>
                      </div>
                    </a>
                    <div className="max-w-[160px] rounded-md bg-slate-100 p-3">
                      <div className="flex justify-end ">
                        <FileArrowDown className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-lg font-medium line-clamp-1">
                          {data.industry}
                        </p>
                        <p className="text-xs">Сфера деятельности</p>
                      </div>
                    </div>

                    <Sheet>
                      <SheetTrigger asChild>
                        <div className="max-w-[160px] rounded-md bg-lime-100 p-3 border-2 hover:border-lime-300 cursor-pointer">
                          <div className="flex justify-end ">
                            <FileArrowDown className="w-6 h-6 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-lg font-medium">Ставки</p>
                            <p className="text-xs">
                              {/* {bids && bids.length > 0 ? bids.length : 0} */}
                              1
                            </p>
                          </div>
                        </div>
                      </SheetTrigger>
                      <SheetContent position="right" size="sm">
                        <SheetHeader>
                          <SheetTitle>Ставки</SheetTitle>
                        </SheetHeader>
                        {/* <div className="flex flex-col gap-6 pt-3">
                          {data.wonAuctionBid ? (
                            <div className="bg-slate-100 p-3 rounded-md w-full flex flex-col  gap-3">
                              <p className="text-center font-semibold text-2xl">
                                {data.wonAuctionBid
                                  .price!.toString()
                                  .replace(/\.?0+$/, "")}{" "}
                                ₸
                              </p>
                              <div className="flex justify-between">
                                <Link
                                  href={`/app/profiles/${data.wonAuctionBid.profile_id}`}
                                >
                                  <Button variant="outline">Профиль</Button>
                                </Link>
                                <Link
                                  href={`/app/profiles/${data.wonAuctionBid.profile_id}`}
                                >
                                  <Button variant="outline">
                                    Написать сообщение
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {bids?.map((bid) => (
                            <div key={bid.id}>
                              <div className="bg-slate-100 p-3 rounded-md w-full">
                                <p className=" text-center font-semibold text-2xl">
                                  {bid.price!.toString().replace(/\.?0+$/, "")}{" "}
                                  ₸
                                </p>
                              </div>
                              <Image
                                src={
                                  getImageSrc(bid.profile?.avatar?.url) ??
                                  DefaultImage
                                }
                                width={0}
                                height={0}
                                unoptimized
                                className="object-cover w-6 h-6"
                                alt=""
                              />
                            </div>
                          ))}
                        </div> */}
                      </SheetContent>
                    </Sheet>
                  </div>
                  <div
                    data-orientation="horizontal"
                    role="none"
                    className="bg-slate-200 h-[1px] w-full my-7"
                  />
                  <p className="text-lg font-semibold">Описание</p>
                  <div className="mt-3 flex gap-3">
                    <p className="p-4 bg-slate-100 rounded-md">
                      {data.description}
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="my-10" />
              {data.wonAuctionBid ? (
                ""
              ) : data.isAuthor ? (
                ""
              ) : (
                <div className="flex flex-col sm:flex-row w-full justify-center gap-3">
                  <Button variant="outline" className="w-full">
                    Купить за{" "}
                    <p>
                      <NumericFormat
                        className="ml-2"
                        value={data
                          .purchase_price!.toString()
                          .replace(/\.?0+$/, "")}
                        allowLeadingZeros
                        displayType="text"
                        thousandSeparator=" "
                      />{" "}
                      ₸
                    </p>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="black" className="w-full">
                        Сделать ставку
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[725px] p-6">
                      <DialogHeader>
                        <DialogTitle>Сделайте ставку</DialogTitle>
                        <DialogDescription className="text-xs">
                          Вы сможете в любое время повысить свою ставку. Другие
                          участники будут видеть указанную вами цену
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex gap-10">
                          <div>
                            <p className="font-semibold text-sm ml-1">
                              Стартовая цена
                            </p>
                            <div className="flex gap-10">
                              <p className="bg-slate-100 text-xl sm:text-2xl font-semibold p-4 rounded-md w-fit">
                                <NumericFormat
                                  value={data
                                    .starting_price!.toString()
                                    .replace(/\.?0+$/, "")}
                                  allowLeadingZeros
                                  displayType="text"
                                  thousandSeparator=" "
                                />{" "}
                                ₸
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-sm ml-1">
                              Последняя ваша ставка
                            </p>
                            <div className="flex gap-10">
                              <p className="bg-slate-100 text-xl sm:text-2xl font-semibold p-4 rounded-md w-fit">
                                <NumericFormat
                                  value={data
                                    .starting_price!.toString()
                                    .replace(/\.?0+$/, "")}
                                  allowLeadingZeros
                                  displayType="text"
                                  thousandSeparator=" "
                                />{" "}
                                ₸
                              </p>
                            </div>
                          </div>
                        </div>
                        <Form
                          onSubmit={async (event) => {
                            event.preventDefault();

                            const priceInput = event.currentTarget.price.value;
                            const price = Number.parseFloat(
                              priceInput.replace(/\s/g, "")
                            );
                            await api.createAuctionBid(data.id, { price });
                            await router.reload();
                          }}
                          className="flex flex-col gap-3"
                        >
                          <p>Ваша ставка</p>
                          <div className="flex items-center gap-6">
                            <Field name="price">
                              <Label>Сумма</Label>

                              <NumericFormat
                                placeholder="KZT"
                                min={1}
                                name="price"
                                customInput={Input}
                                thousandSeparator=" "
                              />
                            </Field>
                            <p className="text-xs">
                              Ваша ставка должна быть выше стартовой цены
                            </p>
                          </div>

                          <DialogFooter className="justify-center items-center gap-5">
                            <DialogClose className="w-3/4">
                              <Button className="w-full" variant="outline">
                                отмена
                              </Button>
                            </DialogClose>
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
              )}
              {data.isAuthor && data.verified_at ? (
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
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
