import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { UserCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import api from "../../../api";
import { buildFormData } from "../../../api/files";
import {} from "../../../api/user-file";
import { Navigation } from "../../../components/navigation";
import { Button } from "../../../components/primitives/button";
import DefaultAva from "../../../images/avatars/defaultProfile.svg";

const secondaryNavigation = [
  { name: "Аккаунт", href: "#", icon: UserCircle, current: true },
  //   { name: "Security", href: "#", icon: FingerPrintIcon, current: false },
  //   { name: "Notifications", href: "#", icon: BellIcon, current: false },
  //   { name: "Plan", href: "#", icon: CubeIcon, current: false },
  //   { name: "Billing", href: "#", icon: CreditCardIcon, current: false },
  //   { name: "Team members", href: "#", icon: UsersIcon, current: false },
];

export default function Settings() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const [userId, setUserId] = useState();

  const router = useRouter();
  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event: any) => {
    const fileObj = event.target.files && event.target.files[0];

    if (!fileObj) {
      return;
    }

    api.users.avatar(userId, buildFormData(fileObj));
    router.reload();
  };
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
              <div>
                <input
                  ref={inputRef}
                  style={{ display: "none" }}
                  type="file"
                  placeholder="shitty"
                  onChange={handleFileChange}
                />
                <Button onClick={handleClick}>Поменять фото</Button>
                <p className="mt-2 text-xs leading-5 text-gray-400">
                  JPG или PNG. 1MB макс.
                </p>
              </div>
            </div>
            {/* <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Эта информация будет отображаться публично, поэтому будьте
                осторожны с тем, чем вы делитесь.
              </p>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Full name
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">Tom Cook</div>
                    <button
                      type="button"
                      className="font-semibold text-lime-600 hover:text-lime-500"
                    >
                      Update
                    </button>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Email address
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">tom.cook@example.com</div>
                    <button
                      type="button"
                      className="font-semibold text-lime-600 hover:text-lime-500"
                    >
                      Update
                    </button>
                  </dd>
                </div>
              </dl>
            </div> */}
          </div>
        </main>
      </div>
    </>
  );
}
