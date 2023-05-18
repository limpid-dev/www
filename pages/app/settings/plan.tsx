import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Switch } from "@headlessui/react";
import { Cube, UserCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import api from "../../../api";
import { buildFormData } from "../../../api/files";
import {} from "../../../api/user-file";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/primitives/table";
import DefaultAva from "../../../images/avatars/defaultProfile.svg";

const secondaryNavigation = [
  { name: "Аккаунт", href: "/app/settings", icon: UserCircle, current: false },
  //   { name: "Security", href: "#", icon: FingerPrintIcon, current: false },
  //   { name: "Notifications", href: "#", icon: BellIcon, current: false },
  { name: "Plan", href: "#", icon: Cube, current: true },
  //   { name: "Billing", href: "#", icon: CreditCardIcon, current: false },
  //   { name: "Team members", href: "#", icon: UsersIcon, current: false },
];

export default function Settings() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const [userId, setUserId] = useState();
  const [availableToHire, setAvailableToHire] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allowCommenting, setAllowCommenting] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);
  const router = useRouter();

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUser() {
      const { data } = await api.session.show();
      setUserId(data.id);
      if (data) {
        const { data: user } = await api.users.show(data.id);
        setUser(user);
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      <Navigation />

      <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
        <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-16">
          <nav className="flex-none px-4 sm:px-6 lg:px-0">
            <ul className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={clsx(
                      item.current
                        ? "bg-gray-50 text-lime-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-lime-600",
                      "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6"
                    )}
                  >
                    <item.icon
                      className={clsx(
                        item.current
                          ? "text-lime-600"
                          : "text-gray-400 group-hover:text-lime-600",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-16">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div className="col-span-full flex items-center gap-x-8">
              <Image
                src={user.file ? user.file.url : DefaultAva}
                width={0}
                height={0}
                unoptimized
                alt=""
                className=" h-44 w-44 flex-none rounded-lg bg-gray-100 object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900 mb-4">
                Информация по вашему плану
              </h2>
              <Table>
                <TableCaption>
                  Детальная информация по вашему плану.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">План</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Проектов осталось</TableHead>
                    <TableHead>Участия на аукционах</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">LIGHT</TableCell>
                    <TableCell>Оплачено</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>7</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
