import {
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
import api from "../../../../api";
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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/primitives/sheet";
import { TextArea } from "../../../../components/primitives/text-area";
import getImageSrc from "../../../../hooks/get-image-url";
import DefaultImage from "../../../../images/avatars/defaultProfile.svg";

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
    .filter((value) => typeof value === "object" && value !== null && value.url)
    .map((value) => value);

  return {
    props: {
      data: {
        ...auction.data,
        isAuthor: isAuthor!,
        images: photoArray!,
      },
    },
  };
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

  const [bids, setBids] = useState();

  const handleDeleteAuction = async () => {
    await api.deleteAuction(parsedId);
    await router.push({
      pathname: `/app/auctions/`,
    });
  };

  const handlePurchasePrice = async () => {
    await api.createAuctionBid(data.id, { price: data.purchase_price });
    await router.reload;
  };

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

        <div className="">
          {data.verified_at ? (
            ""
          ) : (
            <div className="flex gap-2 justify-center py-4 bg-lime-300  rounded-md my-4 font-bold text-base">
              <ShieldWarning className="w-6 h-6" /> Объявление на рассмотрении y
              модератора: 1 день
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
                      <div className="flex flex-row ml-[-0.1rem]">
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

              <div className="col-span-6">
                <p className=" text-3xl font-semibold">{data.title}</p>

                <div className="grid grid-cols-4 gap-4 mt-7">
                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="flex justify-end">
                      <Lightbulb className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-lg mt-4">
                      {data.verified_at ? "Прием ставок" : "На модерации"}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">Cтатус</p>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="flex justify-end">
                      <Medal className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className=" font-medium text-lg mt-4">
                      {data.duration.days} дня/дней
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
                        {data.starting_price!.toString().replace(/\.?0+$/, "")}{" "}
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
                      <div className="bg-lime-100 p-3 rounded-md">
                        <div className="flex justify-end">
                          <Medal className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className=" font-medium text-lg mt-4">
                          {bids && bids.length > 0 ? bids.length : 0}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          Ставки
                        </p>
                      </div>
                    </SheetTrigger>
                    <SheetContent position="right" size="sm">
                      <SheetHeader>
                        <SheetTitle>Ставки</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-6 pt-3">
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
                                {bid.price!.toString().replace(/\.?0+$/, "")} ₸
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
                      </div>
                    </SheetContent>
                  </Sheet>
                  <div className="bg-slate-100 col-span-2 rounded-md p-3">
                    <div>
                      <p className="text-slate-500 font-medium">
                        Цена мгновенной продажи
                      </p>
                      <p className=" font-semibold text-2xl mt-2">
                        {data.purchase_price!.toString().replace(/\.?0+$/, "")}{" "}
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
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  className="w-3/12"
                  onClick={handlePurchasePrice}
                >
                  Купить за{" "}
                  {data.purchase_price!.toString().replace(/\.?0+$/, "")}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="black" className="w-3/12">
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
                      <p className="font-semibold">Стартовая цена</p>
                      <p className="bg-slate-100 text-2xl font-semibold p-4 rounded-md w-fit">
                        {data.starting_price!.toString().replace(/\.?0+$/, "")}{" "}
                        ₸
                      </p>

                      <Form
                        onSubmit={async (event) => {
                          event.preventDefault();

                          const price = event.currentTarget.price.valueAsNumber;
                          await api.createAuctionBid(data.id, { price });
                        }}
                        className="flex flex-col gap-3"
                      >
                        <p>Ваша ставка</p>
                        <div className="flex items-center gap-6">
                          <Field name="price">
                            <Label>Сумма</Label>
                            <Input
                              placeholder="KZT"
                              type="number"
                              min={1}
                              name="price"
                            />
                          </Field>
                          <p className="text-xs">
                            Ваша ставка должна быть выше стартовой цены
                          </p>
                        </div>

                        <DialogFooter className="justify-center">
                          <Button variant="outline" className="w-3/4">
                            Отмена
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
