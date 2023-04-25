import { Faders, SquaresFour } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../api";
import { Entity } from "../../../api/profiles";
import * as Users from "../../../api/users";
import { Navigation } from "../../../components/Navigation";
import { Button } from "../../../components/Primitives/Button";
import { Skeleton } from "../../../components/Primitives/Skeleton";
import testAva from "../../../images/avatars/defaultProfile.svg";

const tabs = [
  { name: "Все профили", href: "/app/profiles/", current: true },
  { name: "Мои профили", href: "/app/profiles/my", current: false },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function All() {
  const [search, setSearch] = useState("");
  const [profilesData, setProfilesData] = useState<
    (Entity & { user: Users.Show["Data"] })[]
  >([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  const handleSelectChange = (event: any) => {
    const selectedPage = event.target.value;
    router.push(selectedPage);
  };

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await api.profiles.index({
        page: 1,
        perPage: 100,
      });

      const withUsers = data!.map(async (d) => {
        const user = await api.users.show(d.userId);

        return { ...d, user: user.data! };
      });

      const w = await Promise.all(withUsers);

      if (data) {
        setProfilesData(w);
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  return (
    <div>
      <Navigation />
      <div className="h-screen bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-5 pt-8">
          <p className=" text-sm text-slate-300">Профили</p>
          <div className="my-5 flex flex-col items-center justify-end gap-4 md:mb-12 md:flex-row  md:justify-between">
            <div>
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
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
                      className={classNames(
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
            <div className="flex flex-wrap items-end justify-end gap-3">
              <div className="flex rounded-lg border">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                <Button variant="outline">
                  <SquaresFour className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Skeleton className="h-[127px] w-[400px] rounded-md" />
              </div>
            ) : (
              <>
                {profilesData.map((profile) => (
                  <Link key={profile.id} href={`/app/profiles/${profile.id}`}>
                    <div className="rounded-lg border border-slate-200 bg-white p-4 hover:border-black">
                      <div className="grid grid-cols-10">
                        <div className="col-span-4">
                          <Image
                            src={testAva}
                            alt="test"
                            className=" h-32 w-32 rounded-lg"
                          />
                        </div>
                        <div className="col-span-6 flex flex-col gap-1 pl-3">
                          <p>
                            {profile.user.firstName} {profile.user.lastName}
                          </p>

                          <p className="text-xs text-slate-400">
                            {profile.industry}
                          </p>
                          <p className="text-xs text-slate-400">
                            {profile.title}
                          </p>
                          <p className="text-sm text-slate-400">
                            {profile.location}
                          </p>

                          <p className="line-clamp-3 w-auto text-xs">
                            {profile.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
