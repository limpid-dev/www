import {
  ArrowCircleUpRight,
  FileArrowDown,
  Lightbulb,
  MaskHappy,
  Medal,
  ShieldWarning,
} from "@phosphor-icons/react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import api from "../../../../api";
import { components } from "../../../../api/api-paths";
import { GeneralLayout } from "../../../../components/general-layout";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/primitives/sheet";
import getImageSrc from "../../../../hooks/get-image-url";
import DefaultImage from "../../../../images/avatars/defaultProfile.svg";

function convertTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const convertedTimestamp = `${day}.${month}.${year}, ${hours}:${minutes}`;
  return convertedTimestamp;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{
    id: string;
  }>
) => {
  const { data: auction } = await api.getAuction(
    Number.parseInt(context!.params!.id as string, 10),
    {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    }
  );

  const { data: user } = await api.getUser({
    headers: {
      Cookie: context.req.headers.cookie,
    },
  });
  const isAuthor = auction.data?.profile_id === user.data.selected_profile_id;
  const photoArray = Object.values(auction.data!)
    .filter(
      (value) =>
        typeof value === "object" &&
        value !== null &&
        value.url &&
        value.extname !== "pdf" &&
        value.extname !== "docx"
    )
    .map((value) => value);

  try {
    const userBidResponse = await api.getUserAuctionBid(auction.data.id, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    });
    const userBid = userBidResponse.data;
    console.log(userBid);
    if (userBid.data?.auction_id) {
      return {
        props: {
          data: {
            ...auction.data,
            isAuthor: isAuthor!,
            images: photoArray!,
            userBid: userBid!,
          },
        },
      };
    }
  } catch (error) {
    return {
      props: {
        data: {
          ...auction.data,
          isAuthor: isAuthor!,
          images: photoArray!,
        },
      },
    };
  }
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Tender({ data }: Props) {
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };
  const parsedId = Number.parseInt(id as string, 10) as number;

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

  const [bids, setBids] = useState<components["schemas"]["AuctionBid"][]>();

  const handleDeleteAuction = async () => {
    await api.deleteAuction(parsedId);
    await router.push({
      pathname: `/app/auctions/`,
    });
  };

  const handlePurchasePrice = async () => {
    await api.createAuctionBid(data.id, {
      price: data.purchase_price,
    });
    await router.reload();
  };

  const handlePurchasePriceUpdate = async () => {
    const priceInput = data.purchase_price;
    const price1 = Number.parseFloat(priceInput.replace(/\s/g, ""));
    await api.updateAuctionBid(
      {
        auction_id: data.id,
        auction_bid_id: data.userBid.data.id,
      },
      { price: price1 }
    );
    await router.reload();
  };

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
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await api.getAuctionBids({
          page: 1,
          per_page: 100,
          auction_id: parsedId,
        });
        setBids(response.data.data || []);
      } catch (error) {
        console.log("Error fetching tenders.");
      }
    };
    const intervalId = setInterval(fetchBids, 1000);
    return () => clearInterval(intervalId);
  }, [parsedId]);

  return (
    <>
      <Navigation />
      <GeneralLayout>
        <h1 className="text-sm">
          <span className="text-slate-300">Аукционы / Продажи / </span>
          {data.title}
        </h1>

        <div className="mt-5">
          {data.verified_at ? (
            ""
          ) : (
            <div className="flex gap-2 justify-center items-center p-3 bg-lime-300  rounded-md my-4 font-bold text-sm sm:text-base">
              <ShieldWarning className="w-6 h-6" />{" "}
              <span className="text-center">
                Объявление на рассмотрении y модератора: 1 день
              </span>
            </div>
          )}

          <div className="p-10 bg-white rounded-md">
            <div className="grid sm:grid-cols-10 gap-8 mt-2 rounded-md">
              <div className="sm:col-span-4">
                <div className="embla">
                  <div
                    className=" overflow-hidden rounded-md"
                    ref={emblaMainRef}
                  >
                    <div className="flex flex-row h-auto ml-[-1rem] ">
                      {data.images.map((image, index) => (
                        <div
                          key={index}
                          className="overflow-hidden flex-[0_0_100%] min-w-0 relative "
                        >
                          <Image
                            className="h-[19rem] w-auto m-auto rounded-md"
                            src={getImageSrc(image.url) ?? DefaultImage}
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
                      <div className="flex gap-2 flex-row ml-[-0.1rem]">
                        {data.images.map((image, index) => (
                          <Thumb
                            key={index}
                            onClick={() => onThumbClick(index)}
                            selected={index === selectedIndex}
                            index={index}
                            imgSrc={getImageSrc(image.url) ?? DefaultImage}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <Link href={"/app/profiles/" + data.profile_id}>
                  <div className="bg-slate-100 mt-3 rounded-md p-3 flex flex-col gap-2 border hover:border hover:border-lime-300">
                    <p className=" font-medium">Продавец</p>
                    <div className="flex items-center gap-5">
                      <Image
                        width={0}
                        height={0}
                        unoptimized
                        className="w-10 h-10 object-cover rounded-md"
                        alt="alte test"
                        src={
                          getImageSrc(data.profile?.avatar?.url) ?? DefaultImage
                        }
                      />
                      <p className=" font-semibold">
                        {data.profile?.display_name}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="sm:col-span-6">
                <p className=" text-3xl font-semibold">{data.title}</p>

                <div className="grid sm:grid-cols-4 gap-4 mt-7">
                  {data.technical_specification?.url ? (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={getImageSrc(data.technical_specification.url)}
                    >
                      <div className="bg-lime-300 p-3 rounded-md border border-lime-300">
                        <div className="flex justify-end">
                          <FileArrowDown className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="font-medium text-lg mt-4">
                          {data.verified_at ? "Документ" : "На модерации"}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          Скачать
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="bg-slate-100 p-3 rounded-md">
                      <div className="flex justify-end">
                        <Lightbulb className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-medium text-lg mt-4">
                        {data.verified_at ? "Прием ставок" : "На модерации"}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        Cтатус
                      </p>
                    </div>
                  )}
                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="flex justify-end">
                      <Medal className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className=" font-medium text-lg mt-4">
                      {JSON.parse(data.duration).days} дня/дней
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
                  {data.finishedAt ? (
                    <div className="bg-slate-100 p-3 rounded-md">
                      <div className="flex justify-end">
                        <MaskHappy className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className=" font-medium text-lg mt-4">
                        {new Date(data.finishedAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        Окончание аукциона
                      </p>
                    </div>
                  ) : (
                    ""
                  )}{" "}
                  <Sheet>
                    <SheetTrigger asChild>
                      <div className="bg-lime-100 p-3 rounded-md cursor-pointer">
                        <div className="flex justify-end">
                          <ArrowCircleUpRight className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className=" font-medium text-lg mt-4">
                          {bids && bids.length > 0 ? bids.length : 0}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          Ставки
                        </p>
                      </div>
                    </SheetTrigger>
                    <SheetContent
                      position="right"
                      size={largeScreen ? "default" : "full"}
                    >
                      <SheetHeader>
                        <SheetTitle>Ставки</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-6 pt-3">
                        {data.wonAuctionBid ? (
                          <div className="flex flex-col rounded-md">
                            <div className="flex justify-between bg-slate-100 px-6 py-3 rounded-t-md">
                              <div className="flex gap-3 items-center">
                                <Image
                                  src={
                                    getImageSrc(
                                      data.wonAuctionBid.profile?.avatar?.url
                                    ) ?? DefaultImage
                                  }
                                  width={0}
                                  height={0}
                                  unoptimized
                                  className="object-cover w-9 h-9 rounded-md"
                                  alt=""
                                />
                                {data.wonAuctionBid.profile?.display_name}{" "}
                                <span className="p-1 rounded-lg text-sm text-white bg-lime-500">
                                  Победитель
                                </span>
                              </div>
                              <p className="text-center font-semibold text-2xl">
                                {data.wonAuctionBid
                                  .price!.toString()
                                  .replace(/\.?0+$/, "")}{" "}
                                ₸
                              </p>
                            </div>
                            <Separator className="bg-white" />
                            <div className="flex justify-between items-center bg-slate-100 px-6 py-3 rounded-b-md">
                              <div className="flex flex-col text-xs gap-1">
                                <p>Дата и время ставки:</p>
                                {convertTimestamp(
                                  data.wonAuctionBid.created_at
                                )}
                              </div>
                              {data.isAuthor && (
                                <div className="flex gap-3">
                                  <Link
                                    href={`/app/profiles/${data.wonAuctionBid.profile_id}`}
                                  >
                                    <Button variant="outline">Профиль</Button>
                                  </Link>
                                  <Link
                                    href={`/app/profiles/${data.wonAuctionBid.profile_id}`}
                                  >
                                    <Button variant="black">Написать</Button>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {bids?.map((bid) => (
                          <div key={bid.id}>
                            <div className="flex flex-col rounded-md">
                              <div className="flex justify-between bg-slate-100 px-6 py-3 rounded-t-md">
                                <div className="flex gap-3 items-center">
                                  <Image
                                    src={
                                      getImageSrc(bid.profile?.avatar?.url) ??
                                      DefaultImage
                                    }
                                    width={0}
                                    height={0}
                                    unoptimized
                                    className="object-cover w-9 h-9 rounded-md"
                                    alt=""
                                  />
                                  <p>{bid.profile?.display_name}</p>
                                </div>
                                <p className="text-center font-semibold text-2xl">
                                  {bid.price!.toString().replace(/\.?0+$/, "")}{" "}
                                  ₸
                                </p>
                              </div>
                              <Separator className="bg-white" />
                              <div className="flex justify-between items-center bg-slate-100 px-6 py-3 rounded-b-md">
                                <div className="flex gap-3">
                                  <p className="text-xs">
                                    Дата и время ставки:{" "}
                                    {convertTimestamp(bid.created_at)}
                                  </p>
                                </div>
                                {data.isAuthor && (
                                  <Link
                                    href={`/app/profiles/${bid.profile_id}`}
                                  >
                                    <Button variant="outline">Профиль</Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                  <div className="bg-slate-100 col-span-2 rounded-md p-3">
                    <div>
                      <p className="text-slate-500 font-medium">
                        Цена мгновенной продажи
                      </p>
                      <p className=" font-semibold text-2xl mt-2">
                        <NumericFormat
                          value={data
                            .purchase_price!.toString()
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

                <div>
                  <p className="font-semibold text-xl mt-11">Описание</p>
                  <p className="mt-3">{data.description}</p>
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
                {data.userBid ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handlePurchasePriceUpdate}
                  >
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
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handlePurchasePrice}
                  >
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
                )}

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
                        {data.userBid.data?.price ? (
                          <div>
                            <p className="font-semibold text-sm ml-1">
                              Последняя ваша ставка
                            </p>
                            <div className="flex gap-10">
                              <p className="bg-slate-100 text-xl sm:text-2xl font-semibold p-4 rounded-md w-fit">
                                <NumericFormat
                                  value={data.userBid.data
                                    .price!.toString()
                                    .replace(/\.?0+$/, "")}
                                  allowLeadingZeros
                                  displayType="text"
                                  thousandSeparator=" "
                                />{" "}
                                ₸
                              </p>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      {data.userBid ? (
                        <Form
                          onSubmit={async (event) => {
                            event.preventDefault();

                            const priceInput = event.currentTarget.price.value;
                            const price = Number.parseFloat(
                              priceInput.replace(/\s/g, "")
                            );
                            await api.updateAuctionBid(
                              {
                                auction_id: data.id,
                                auction_bid_id: data.userBid.data.id,
                              },
                              { price }
                            );
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
                      ) : (
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
                          <p>Ваша def</p>
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
                      )}
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
                      <AlertDialogAction
                        onClick={handleDeleteAuction}
                        className="w-[90px] bg-rose-600 hover:bg-red-900"
                      >
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
      </GeneralLayout>
    </>
  );
}
