import { PaperPlaneRight } from "@phosphor-icons/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import api from "../../../api";
import { components } from "../../../api/api-paths";
import { GeneralLayout } from "../../../components/general-layout";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import { TextArea } from "../../../components/primitives/text-area";
import { useSelectedProfile } from "../profiles/[id]";

function getCharacterAfterComma(str: any) {
  const commaIndex = str.indexOf(",");

  if (commaIndex === -1 || commaIndex === str.length - 1) {
    return null; // No comma found or it's the last character
  }

  return str.charAt(commaIndex + 2);
}

function removeSubstring(originalString, stringToRemove) {
  const regex = new RegExp(stringToRemove, "g");
  const resultString = originalString
    .replace(regex, "")
    .replace(/,/g, "")
    .trim();
  return resultString;
}

const tabs = [
  { name: "Личные", href: "/app/auctions/", current: true },
  { name: "Проекты", href: "/app/auctions/my", current: false },
];

export default function Chats() {
  const profile = useSelectedProfile();
  const router = useRouter();
  const [chats, setChats] = useState<components["schemas"]["Chat"][]>([]);
  const [chat, setChat] = useState<components["schemas"]["Chat"] | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] =
    useState<components["schemas"]["Message"][]>();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchUser() {
      const { data: sessionData } = await api.getUser();
      if (sessionData.data.id) {
        setUser(sessionData.data);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      if (!router.query.id) {
        api.getChats().then(({ data: { data } }) => {
          setChats(data);
          const c = data.at(0);
          if (c) {
            setChatId(c.id!);
            setChat(c);
            router.push(`/app/chats/${c.id}`, undefined);
          }
        });
      }
      if (router.query.id) {
        api.getChats().then(({ data: { data } }) => {
          setChats(data);
        });
        setChatId(Number.parseInt(router.query.id as string, 10));
      }
    }
  }, [router]);

  useEffect(() => {
    if (chatId) {
      axios
        .get(`/api/chats/${chatId}`)
        .then((v) => v.data.data)
        .then((v) => {
          setChat(v);
        });

      const id = setInterval(() => {
        api
          .getMessages({
            path: {
              chat_id: chatId,
            },
          })
          .then(({ data: { data } }) => {
            setMessages(data);
          });
      }, 1000);

      return () => clearInterval(id);
    }
  }, [chatId]);

  return (
    <div>
      <Navigation />
      <GeneralLayout>
        {/* <p className="text-sm text-slate-300">Профили</p>
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
        </div> */}

        <div className="grid gap-10 sm:grid-cols-10">
          <div className="sm:col-span-4 h-[74vh] bg-white rounded-md border p-8 order-last sm:order-first overflow-auto">
            {/* <nav
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
            </nav> */}
            <div className="flex flex-col gap-3">
              {chats.map((c) => (
                <Link
                  key={c.id}
                  href={`/app/chats/${c.id}`}
                  className="grid grid-cols-10 justify-center items-cente hover:bg-slate-100 p-3 rounded-md"
                >
                  {/* <Image
                  src={testAva}
                  className="w-[55px] h-[55px] rounded-lg col-span-2"
                  alt="test"
                /> */}
                  <div className="col-span-7">
                    <div className="flex items-center gap-3">
                      <div className="text-sm rounded-lg w-8 h-8 flex justify-center items-center bg-lime-400 text-black font-medium p-2 col-span-2">
                        {
                          removeSubstring(
                            c.name,
                            user?.first_name + " " + user.last_name
                          )[0]
                        }
                      </div>
                      <p className="font-bold">
                        {removeSubstring(
                          c.name,
                          user?.first_name + " " + user.last_name
                        )}
                      </p>
                    </div>
                    <p className="line-clamp-2 text-sm">
                      {(c as any).messages.at(0)?.message ?? "Нет сообщений..."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="sm:col-span-6 border rounded-md">
            <div className="text-center bg-slate-100 font-semibold py-3 rounded-t-md">
              {chat?.name}
            </div>
            <div className="bg-white rounded-b-md">
              <div className=" h-[59vh] rounded-b-md pt-3 overflow-auto">
                {/* <div className="flex justify-center items-center ">
                  <p className="text-slate-500 bg-slate-50 text-sm mb-2 p-2 rounded-2xl">
                    30 апреля
                  </p>
                </div> */}

                <div className="flex flex-col gap-6 mb-4">
                  {messages?.map((m) => {
                    if (profile?.user_id === m.user_id) {
                      return (
                        <div
                          key={m.id}
                          className="flex items-end gap-3 ml-auto mr-3"
                        >
                          <p className="text-sm bg-slate-200 h-min p-3 rounded-lg w-3/4">
                            {m.message}
                          </p>
                          <p className="text-xs">
                            {new Date(m.created_at!.toString()).getHours()}:
                            {new Date(m.created_at!.toString()).getMinutes()}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <div key={m.id} className="flex items-end mr-auto gap-3">
                        {/* <Image
                          src={testAva}
                          className="w-[34px] h-[34px] ml-3 rounded-lg col-span-2"
                          alt="test"
                        /> */}
                        <div className="text-sm rounded-lg w-8 h-8 flex justify-center items-center bg-lime-400 text-black font-medium p-2 ml-3 col-span-2">
                          {(m as any).user?.first_name[0]}
                          {(m as any).user?.last_name[0]}
                        </div>
                        <p className="text-sm bg-slate-200 h-min p-3 rounded-lg w-3/4 ">
                          {m.message}
                        </p>
                        <p className="text-xs">
                          {new Date(m.created_at!.toString()).getHours()}:
                          {new Date(m.created_at!.toString()).getMinutes()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const values = Object.fromEntries(formData.entries()) as {
                    message: string;
                  };

                  await api.sendMessage(chat!.id!, values.message);

                  (e.target as any)?.reset();
                }}
                className="flex items-center justify-around gap-3 px-6 py-3 rounded-b-md"
              >
                <TextArea
                  required
                  name="message"
                  placeholder="Сообщение"
                  className=" h-[38px] w-[90%]"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-slate-100"
                >
                  <PaperPlaneRight />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </GeneralLayout>
    </div>
  );
}
