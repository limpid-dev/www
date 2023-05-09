import { Flashlight, Lightbulb, ShieldWarning } from "@phosphor-icons/react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { GetStaticPropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import api from "../../../../api";
import { Navigation } from "../../../../components/navigation";
import { Thumb } from "../../../../components/primitives/embla-thumbs";

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
            <span className="text-slate-300">
              Аукционы / Продажи / {data.title}
            </span>
          </h1>

          <div className="">
            <div className="flex gap-2 justify-center py-4 bg-lime-300 rounded-md mt-4 font-bold text-base">
              <ShieldWarning className="w-6 h-6" /> Объявление на рассмотрении y
              модератора: 1 день
            </div>
            <div className="grid grid-cols-10 gap-8 bg-white mt-2 rounded-md px-14 py-16">
              <div className=" col-span-4">
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
              </div>
              <div className=" col-span-6">
                <p className=" text-3xl font-semibold">{data.title}</p>

                <div className="grid grid-cols-4 gap-4 mt-7">
                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="flex justify-end">
                      <Lightbulb className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className=" font-medium text-lg mt-4">Прием ставок</p>
                    <p className="text-sm text-slate-500 font-medium">Cтатус</p>
                  </div>

                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="flex justify-end">
                      <Lightbulb className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className=" font-medium text-lg mt-4">{data.duration}</p>
                    <p className="text-sm text-slate-500 font-medium">статус</p>
                  </div>

                  <div className="col-span-2">s</div>

                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="flex justify-end">
                      <Lightbulb className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className=" font-medium text-lg mt-4">{data.duration}</p>
                    <p className="text-sm text-slate-500 font-medium">статус</p>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md">
                    <div className="flex justify-end">
                      <Lightbulb className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className=" font-medium text-lg mt-4">{data.duration}</p>
                    <p className="text-sm text-slate-500 font-medium">статус</p>
                  </div>

                  <div className="col-span-2">s</div>
                </div>
                <p>Описание</p>
                <p>{data.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
