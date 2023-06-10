import {
  Clipboard,
  Faders,
  Paperclip,
  SquaresFour,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect } from "react";
import api from "../../../api";
import { GeneralLayout } from "../../../components/general-layout";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import { Options } from "../../../components/primitives/options";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/primitives/sheet";
import { TextArea } from "../../../components/primitives/text-area";
import testAva from "../../../images/avatars/avatar-2.webp";
import DefaultAvatar from "../../../images/avatars/defaultProfile.svg";

const tabs = [
  { name: "Личные", href: "/app/auctions/", current: true },
  { name: "Проекты", href: "/app/auctions/my", current: false },
];

// export const getServerSideProps = async () => {
//   const { data: profiles } = await api.profiles.index({
//     page: 1,
//     perPage: 100,
//   });

//   const withUsers = profiles!.map(async (d) => {
//     const user = await api.users.show(d.userId);

//     return { ...d, user: user.data! };
//   });

//   const w = await Promise.all(withUsers);

//   return {
//     props: {
//       data: {
//         profilesWithUser: w!,
//       },
//     },
//   };
// };

// type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Chats() {
  const router = useRouter();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  useEffect(() => {
    async function fetchChats() {
      const response = await api.getChats({
        page: 1,
        per_page: 100,
      });
      console.log(response.data.data);
    }
    fetchChats();
  }, []);

  return (
    <div>
      <Navigation />
      <GeneralLayout>
        <p className="text-sm text-slate-300">Профили</p>
        <div className="my-5 flex flex-col items-center justify-end gap-4 md:mb-12 md:flex-row">
          <div className="flex flex-wrap gap-3">
            <div className="flex rounded-md border">
              <input
                type="search"
                placeholder="Искать по профилям"
                className="rounded-lg border-none"
              />
              <Button
                type="submit"
                className=" bg-transparent ring-0 ring-transparent hover:bg-slate-100 active:bg-slate-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </Button>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">
                <Faders className="h-6 w-6" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <SquaresFour className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent position="right" size="default">
                  <SheetHeader>
                    <SheetTitle>Сфера деятельности</SheetTitle>
                    <SheetDescription>
                      Выберите сферы деятельности интересующие вас
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid grid-cols-2 gap-4 py-4 overflow-auto h-[88%]">
                    {Options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 bg-slate-50 rounded-md p-3"
                      >
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="rounded-md"
                        />
                        <p className="text-sm">{option.name}</p>
                      </div>
                    ))}
                  </div>
                  <SheetFooter>
                    <Button type="reset" variant="outline">
                      Сбросить
                    </Button>
                    <Button
                      type="submit"
                      className={clsx(
                        " bg-slate-900 text-white hover:bg-slate-800"
                      )}
                      variant="subtle"
                    >
                      Применить
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-10">
          <div className="col-span-4 h-[70vh] bg-white rounded-md border p-8">
            <nav
              className="flex justify-center space-x-4 w-fit m-auto rounded-3xl p-2 bg-slate-50"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={clsx(
                    tab.current
                      ? "bg-slate-900 text-white rounded-3xl"
                      : "text-gray-500 hover:text-gray-700",
                    "py-3 px-12 text-sm font-medium"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                </a>
              ))}
            </nav>
            <div>
              <div className="grid grid-cols-10 pt-8 justify-center items-center">
                <Image
                  src={testAva}
                  className="w-[55px] h-[55px] rounded-lg col-span-2"
                  alt="test"
                />
                <div className="col-span-7">
                  <p className="font-bold">Nurgali Almaz</p>
                  <p className="line-clamp-2 text-sm">
                    Вы: Да, я собрал почти все необходимые документы, кроме Вы:
                    Да, я собрал почти все необходимые документы, кроме ...
                  </p>
                </div>
                <div className="col-span-1 flex flex-col gap-2 items-end">
                  <p className="text-slate-400 text-sm">17:33</p>
                  <p className="bg-lime-500 rounded-full w-min px-2 text-white">
                    1
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-6 border rounded-md">
            <div className="text-center bg-slate-100 font-semibold py-3 rounded-t-md">
              Nurgali Almaz
            </div>
            <div className="bg-white rounded-b-md">
              <div className=" h-[59vh] rounded-b-md pt-3 overflow-auto">
                <div className="flex justify-center items-center ">
                  <p className="text-slate-500 bg-slate-50 text-sm mb-2 p-2 rounded-2xl">
                    30 апреля
                  </p>
                </div>
                <div className="flex items-end gap-3">
                  <Image
                    src={testAva}
                    className="w-[34px] h-[34px] ml-3 rounded-lg col-span-2"
                    alt="test"
                  />
                  <p className="text-sm bg-slate-200 h-min p-3 rounded-lg w-3/4 ">
                    Салют, я Артур. Есть опыт в работе с тепличными комплексами,
                    думаю, что смогу быть полезен. Напиши мне на ватсап. 8 707
                    777 77 77
                  </p>
                  <p className="text-xs">17:33</p>
                </div>
              </div>
              <div className="flex items-center justify-around gap-3 px-6 pb-3 rounded-b-md">
                <TextArea
                  placeholder="Сообщение"
                  className=" h-[38px] w-[90%]"
                />
                <Button variant="outline" className="bg-slate-100">
                  <Paperclip />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </GeneralLayout>
    </div>
  );
}
