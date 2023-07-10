import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Cube, UserCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import api from "../../../api";
import { Navigation } from "../../../components/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/primitives/table";

const secondaryNavigation = [
  { name: "Аккаунт", href: "/app/settings/", icon: UserCircle, current: false },
  {
    name: "План подписки",
    href: "/app/settings/plan",
    icon: Cube,
    current: true,
  },
];

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { data: session } = await api.getUser({
    headers: {
      Cookie: context.req.headers.cookie,
    },
  });
  console.log(session.data);

  return {
    props: {
      data: {
        userInfo: session.data!,
      },
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Settings({ data }: Props) {
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
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900 mb-4">
                Информация по вашему плану
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">План</TableHead>
                    <TableHead>Проектов осталось</TableHead>
                    <TableHead>Участия на аукционах</TableHead>
                    <TableHead>Дата окончания подписки</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {data.userInfo.plan_id === null && "Start"}
                    </TableCell>
                    <TableCell>{data.userInfo.projects_attempts}</TableCell>
                    <TableCell>{data.userInfo.auctions_attempts}</TableCell>
                    <TableCell>{data.userInfo.payment_end}</TableCell>
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
