import { Anchor, CaretRight, SquaresFour } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { PopoverAnchor } from "@radix-ui/react-popover";
import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../api";
import { GeneralLayout } from "../../../components/general-layout";
import { Navigation } from "../../../components/navigation";
import Pagination from "../../../components/pagination";
import { Button } from "../../../components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/primitives/dialog";
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
import { Skeleton } from "../../../components/primitives/skeleton";
import testAva from "../../../images/projectDefault.svg";

const tabs = [
  { name: "Все проекты", href: "/app/projects/", current: true },
  { name: "Мои проекты", href: "/app/projects/my", current: false },
];

export default function All() {
  const router = useRouter();

  const currentPage =
    (Number.parseInt(router.query.page as string, 10) as number) || 1;
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleCheckboxChange = (event) => {
    const value = Number(event.target.value);
    if (selectedCheckboxes.includes(value)) {
      setSelectedCheckboxes(selectedCheckboxes.filter((id) => id !== value));
    } else {
      setSelectedCheckboxes([...selectedCheckboxes, value]);
    }
  };
  const handleReset = () => {
    setSelectedCheckboxes([]);
    setSearchTerm("");
  };
  const [totalItems, setTotalItems] = useState<any>(1);
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const OPTIONS: EmblaOptionsType = { align: "center", loop: true };
  const [emblaRef] = useEmblaCarousel(OPTIONS, [Autoplay()]);

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [largeScreen, setLargeScreen] = useState(false);
  useEffect(() => {
    handleSearch();
  }, [selectedCheckboxes, searchTerm]);

  const handleSearch = async () => {
    const industries = selectedCheckboxes
      .map((id) => {
        const option = Options.find((option) => option.id === id);
        return option ? option.name : null;
      })
      .filter(Boolean);

    const { data } = await api.getProjects({
      page: 1,
      per_page: 6,
      industry: industries,
      search: searchTerm,
    });

    const profileDataArray = await Promise.all(
      data.data.map(async (project) => {
        const { data: sessionData } = await api.getProfileById(
          project.profile_id
        );
        return { ...project, profile_data: sessionData };
      })
    );

    setData(profileDataArray);
  };

  const handleRoute = async (project_id) => {
    const { data } = await api.getUser();
    if (data.data.selected_profile_id) {
      router.push(`/app/projects/${project_id}`);
    } else {
      setOpenDialog(true);
    }
  };

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
    async function fetchProjects() {
      const { data } = await api.getProjects({
        page: currentPage,
        per_page: 6,
      });
      const profileDataArray = await Promise.all(
        data.data.map(async (project) => {
          const { data: sessionData } = await api.getProfileById(
            project.profile_id
          );
          return { ...project, profile_data: sessionData };
        })
      );
      if (profileDataArray.length > 0) {
        setData(profileDataArray);
        setTotalItems(data.meta.total);
        setLoading(false);
      }
    }
    fetchProjects();
  }, [currentPage]);

  return (
    <>
      <Navigation />
      <div className="hidden">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger />
          <DialogContent className="sm:max-w-[425px] p-10">
            <DialogHeader>
              <DialogTitle className="text-center">
                У вас нет профиля
              </DialogTitle>
              <DialogDescription>
                Вам необходим профиль для участия в проектах
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Button
                onClick={() => {
                  router.push("/app/profiles/create");
                }}
                variant="black"
                type="reset"
                className="w-full"
              >
                Создать профиль
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="min-h-screen bg-slate-50 pt-8 px-5">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-sm text-slate-300">Проекты</p>
          <div className="my-5 flex flex-col items-end justify-end gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Выберите таб
                </label>
                <select
                  onChange={handleSelectChange}
                  id="tabs"
                  name="tabs"
                  className="block w-full border-gray-300 focus:border-lime-500 focus:ring-lime-500"
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
                          ? "bg-lime-100 text-lime-700 rounded-md"
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
            <div className="flex flex-wrap items-end justify-end gap-3">
              <div className="flex rounded-lg border">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="search"
                  placeholder="Искать по проектам"
                  className="rounded-lg border-none"
                />
                <Button
                  onClick={handleSearch}
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
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <SquaresFour className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    position="right"
                    size={largeScreen ? "default" : "full"}
                  >
                    <SheetHeader>
                      <SheetTitle>Сфера деятельности</SheetTitle>
                      <SheetDescription>
                        Выберите сферы деятельности интересующие вас
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid grid-cols-2 gap-4 py-4 overflow-auto h-[74%] sm:h-[85%]">
                      {Options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-3 bg-slate-50 rounded-md p-3"
                        >
                          <input
                            type="checkbox"
                            value={option.id}
                            checked={selectedCheckboxes.includes(option.id)}
                            onChange={handleCheckboxChange}
                            className="rounded-md"
                          />
                          <p className="text-sm">{option.name}</p>
                        </div>
                      ))}
                    </div>
                    <SheetFooter
                      className={clsx("flex justify-between gap-3 pt-3")}
                    >
                      <DialogPrimitive.Close aria-label="Close" asChild>
                        <Button
                          type="reset"
                          variant="outline"
                          onClick={handleReset}
                          className="w-full"
                        >
                          Сбросить
                        </Button>
                      </DialogPrimitive.Close>
                      <DialogPrimitive.Close aria-label="Close" asChild>
                        <Button
                          type="submit"
                          className={clsx(
                            " bg-slate-900 text-white hover:bg-slate-800 w-full"
                          )}
                          variant="subtle"
                        >
                          Применить
                        </Button>
                      </DialogPrimitive.Close>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <Skeleton className=" h-[150px] rounded-full" />
              <Skeleton className=" h-[150px] rounded-full" />
              <Skeleton className=" h-[150px] rounded-full" />
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                {data.map((project, projectIndex) => (
                  <div key={projectIndex}>
                    <div className=" rounded-2xl border border-slate-200 bg-white hover:border-black">
                      <div className="p-4">
                        <div className="grid w-full grid-cols-10 gap-4 h-[180px]">
                          <div className="col-span-4 sm:col-span-2">
                            <div className="overflow-hidden" ref={emblaRef}>
                              <div className="flex">
                                <div className="relative h-28 flex-[0_0_100%]">
                                  <Image
                                    width={0}
                                    height={0}
                                    unoptimized
                                    fill
                                    className="rounded-md object-cover"
                                    src={
                                      project.logo?.url && project.logo.url
                                        ? `/api/${project.logo.url}`
                                        : testAva
                                    }
                                    alt="Your alt text"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-6 sm:col-span-8 flex flex-col gap-1">
                            <div className="flex justify-between">
                              <p className="text-xs font-semibold sm:text-base line-clamp-1">
                                {project.title}
                              </p>
                              <p className="text-xs text-slate-400">
                                {project.created_at &&
                                  new Date(
                                    project.created_at
                                  ).toLocaleDateString("ru-RU", {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                  })}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="max-w-[300px] text-xs">
                                {project.industry}
                              </p>
                              {/* <p className="flex items-center rounded-2xl bg-lime-500 px-2 py-1 text-[9px] font-bold text-slate-100 sm:text-xs">
                              в ТОПе
                            </p> */}
                            </div>
                            <p className="line-clamp-3 w-auto text-xs">
                              {project.description}
                            </p>
                            {project.profile_data?.data?.is_visible ===
                            false ? (
                              ""
                            ) : (
                              <div className="mt-2 flex gap-4 text-xs">
                                <Link
                                  href={`/app/profiles/${project?.profile_data?.data?.id}`}
                                >
                                  <div className="flex w-fit items-center gap-4 rounded-lg bg-slate-100 p-2 hover:bg-lime-200">
                                    <Image
                                      src={
                                        project.profile_data?.data?.avatar?.url
                                          ? `/api/${project.profile_data.data.avatar.url}`
                                          : testAva
                                      }
                                      alt="test"
                                      unoptimized
                                      width={20}
                                      height={20}
                                      className="rounded-lg"
                                    />
                                    <p className="text-xs sm:text-sm">
                                      {project?.profile_data?.data
                                        ?.legal_structure
                                        ? project?.profile_data?.data
                                            ?.legal_structure
                                        : ""}{" "}
                                      {
                                        project?.profile_data?.data
                                          ?.display_name
                                      }
                                    </p>
                                  </div>
                                </Link>
                              </div>
                            )}
                            <div className="flex justify-end rounded-full">
                              <button
                                onClick={() => handleRoute(project.id)}
                                className="rounded-full bg-slate-900 hover:bg-slate-700 p-2"
                              >
                                <CaretRight className="w-6 h-6 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Pagination
        renderPageLink={(page) => `/app/projects/?page=${page}`}
        itemsPerPage={6}
        totalItems={totalItems}
        currentPage={currentPage}
      />
    </>
  );
}
