import { Briefcase, Plus } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../api";
import { GeneralLayout } from "../../../components/general-layout";
import { Navigation } from "../../../components/navigation";
import Pagination from "../../../components/pagination";
import { Button } from "../../../components/primitives/button";
import { Skeleton } from "../../../components/primitives/skeleton";
import NoProfiles from "../../../images/noProfiles.svg";

const tabs = [
  { name: "Все организации", href: "/app/organizations/", current: false },
  { name: "Мои организации", href: "/app/organizations/my", current: true },
];

export default function All() {
  const router = useRouter();
  const [organizationsData, setOrganizationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentPage =
    (Number.parseInt(router.query.page as string, 10) as number) || 1;

  useEffect(() => {
    async function fetchOrganizations() {
      const { data: session } = await api.getUser();
      try {
        const response = await api.getOrganizations({
          page: currentPage,
          per_page: 100,
          user_id: session.data.id,
        });
        const data = response.data.data;
        console.log(data);
        if (data && data.length > 0) {
          setOrganizationsData(data);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
      setLoading(false);
    }
    fetchOrganizations();
  }, [currentPage]);

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  return (
    <>
      <Navigation />
      <GeneralLayout>
        <p className=" text-sm text-slate-300">Организации</p>
        <div className="my-5 flex flex-col items-center justify-end gap-4 md:mb-12 md:flex-row  md:justify-between">
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
          <Link href="/app/organizations/create">
            <Button
              variant="black"
              className="flex gap-1 bg-black text-xs hover:bg-slate-700 sm:text-sm"
            >
              <Plus /> Создать организацию
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Skeleton className="h-[127px] w-[400px] rounded-md" />
          </div>
        ) : (
          <>
            {organizationsData.length > 0 ? (
              <div>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {organizationsData.map((profile) => (
                    <Link
                      key={profile.id}
                      href={`/app/organizations/${profile.id}`}
                    >
                      <div className=" flex w-auto flex-col items-center justify-center rounded-lg border-[1px] bg-white py-9 font-semibold hover:border-slate-700 sm:max-w-[400px]">
                        <Briefcase className="h-6 w-6" />
                        <p className="w-[203px] text-center text-base sm:text-xl ">
                          {profile.legal_structure} {profile.display_name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-8">
                <Image src={NoProfiles} alt="Нет профилей" />
                <p className=" text-2xl font-semibold">У вас нет организаций</p>
              </div>
            )}
          </>
        )}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3" />
      </GeneralLayout>
    </>
  );
}
