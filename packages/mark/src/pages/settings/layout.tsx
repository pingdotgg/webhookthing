import { CogIcon, KeyIcon, SquaresPlusIcon } from "@heroicons/react/24/outline";

import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRequireAuth } from "../../utils/use-require-auth";

const settingsNav = [
  {
    name: "General Settings",
    subroute: "general",
    icon: CogIcon,
  },
  { name: "Security", subroute: "security", icon: KeyIcon },
  {
    name: "Environments",
    subroute: "environments",
    icon: SquaresPlusIcon,
  },
];

const getPageByRoute = (currentRoute: string) => {
  const subroute = currentRoute.replace("/settings/", "");

  return settingsNav.find((page) => page.subroute === subroute);
};

export const SettingsPageLayout: React.FC<{ children?: React.ReactNode }> = (
  props
) => {
  const router = useRouter();

  useRequireAuth();

  const { data: session, status } = useSession();

  if (status === "loading" || !session) return null;

  const currentPage = getPageByRoute(router.route);

  return (
    <main className="relative">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-full items-start ">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
            <aside className="py-6 lg:col-span-3">
              <nav className="space-y-1">
                {settingsNav.map((item) => {
                  const isCurrent = item.subroute === currentPage?.subroute;

                  return (
                    <Link href={`/settings/${item.subroute}`} key={item.name}>
                      <a
                        className={classNames(
                          isCurrent
                            ? "bg-teal-50 border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-700"
                            : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                          "group border-l-4 px-3 py-2 flex items-center text-sm font-medium"
                        )}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        <item.icon
                          className={classNames(
                            isCurrent
                              ? "text-teal-500 group-hover:text-teal-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                      </a>
                    </Link>
                  );
                })}
              </nav>
            </aside>
            <div className="divide-y divide-gray-200 lg:col-span-9">
              {/* General section */}
              <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    {currentPage?.name}
                  </h2>
                </div>
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
