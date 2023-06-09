import { Plus } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import api from "../../../api";
import { components } from "../../../api/api-paths";
import { GeneralLayout } from "../../../components/general-layout";
import { Navigation } from "../../../components/navigation";
import Pagination from "../../../components/pagination";
import { Button } from "../../../components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/primitives/dialog";
import { Skeleton } from "../../../components/primitives/skeleton";
import AnalyzingMarket from "../../../images/analyzingMarket.svg";
import NoProfiles from "../../../images/noProfiles.svg";
import onLaptop from "../../../images/onLaptop.svg";
import ProfileDefault from "../../../images/profileDefault.svg";

function Profiles() {
  const tabs = [
    { name: "Все профили", href: "/app/profiles/", current: false },
    { name: "Мои профили", href: "/app/profiles/my", current: true },
  ];

  const router = useRouter();

  const currentPage =
    (Number.parseInt(router.query.page as string, 10) as number) || 1;

  const [data, setData] = useState<components["schemas"]["Profile"][]>([]);
  const [loading, setLoading] = useState(true);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  const [totalItems, setTotalItems] = useState(1);

  useEffect(() => {
    async function fetchProfiles() {
      const { data: session } = await api.getUser();
      try {
        const response = await api.getProfiles({
          page: currentPage,
          per_page: 9,
          user_id: session.data.id,
        });
        const data = response.data.data;
        if (data && data.length > 0) {
          setData(data);
          setTotalItems(response.data.meta.total);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
      setLoading(false);
    }
    fetchProfiles();
  }, [currentPage]);

  return (
    <div>
      <div>
        <Navigation />
        <GeneralLayout>
          <p className="text-sm text-slate-300">Профили</p>
          <div className="my-5 flex flex-col items-end justify-end gap-4 md:mb-12 md:flex-row md:justify-between">
            <div>
              <div className="sm:hidden">
                <select
                  onChange={handleSelectChange}
                  id="tabs"
                  name="tabs"
                  className="block w-full  border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                  defaultValue="/app/profiles/my"
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="black"
                  className="flex gap-3 text-xs sm:text-sm"
                >
                  <Plus className="w-5 h-5" /> Создать профиль
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Выберите вид профиля
                  </DialogTitle>
                </DialogHeader>
                <div className="grid sm:grid-cols-2 gap-4 py-4 w-full">
                  <Link href="/app/profiles/create">
                    <div className="flex flex-col items-center rounded-lg border hover:border-black">
                      <Image src={onLaptop} alt="Нет профилей" />
                      <div className="mb-3 flex flex-col items-center">
                        <p className="text-sm font-bold sm:text-lg">
                          Личный профиль
                        </p>
                        <p className="text-xs">физического лица</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/app/organizations/create"
                    className="flex flex-col items-center justify-center rounded-lg border  hover:border-black"
                  >
                    <Image src={AnalyzingMarket} alt="Нет профилей" />
                    <div className="mb-3 flex flex-col items-center">
                      <p className="text-sm font-bold sm:text-lg">
                        Профиль организации
                      </p>
                      <p className="text-xs">для юридического лица</p>
                    </div>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {loading ? (
            <Skeleton className="w-[400px] h-[160px] rounded-full" />
          ) : (
            <>
              {data.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {data.map((profile) => (
                      <Link
                        key={profile.id}
                        href={`/app/profiles/${profile.id}`}
                      >
                        <div className=" flex w-auto flex-col items-center justify-center rounded-lg border-[1px] bg-white py-8 font-semibold hover:border-slate-700 sm:max-w-[400px]">
                          <Image
                            className="h-14 w-14"
                            src={ProfileDefault}
                            alt="some"
                          />
                          <p className="mt-3 text-center text-base sm:text-xl ">
                            {profile.display_name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Pagination
                    renderPageLink={(page) => `/app/profiles/my/?page=${page}`}
                    itemsPerPage={9}
                    totalItems={totalItems}
                    currentPage={currentPage}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-8">
                  <Image src={NoProfiles} alt="Нет профилей" />
                  <p className=" text-2xl font-semibold">У вас нет профиля</p>
                </div>
              )}
            </>
          )}
        </GeneralLayout>
      </div>
    </div>
  );
}

export default Profiles;
