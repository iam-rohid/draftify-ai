import UserDropdown from "@/components/UserDropdown";
import { useAuth } from "@/providers/AuthProvider";
import { User } from "@supabase/supabase-js";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, ReactNode, useMemo, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlineBars3,
  HiOutlineCube,
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineTrash,
  HiOutlineChatBubbleOvalLeft,
} from "react-icons/hi2";

const DashboardLayout: FC<
  PropsWithChildren<{
    compactSidebar?: boolean;
  }>
> = ({ children, compactSidebar = false }) => {
  const [isCompactSidebar, setIsCompactSidebar] = useState(compactSidebar);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const mainMenu = useMemo(
    () => [
      {
        id: "projects",
        name: "Projects",
        href: "/dashboard/projects",
        icon: <HiOutlineHome />,
      },
      {
        id: "templates",
        name: "Templates",
        href: "/dashboard/templates",
        icon: <HiOutlineSquares2X2 />,
      },
      {
        id: "chat",
        name: "Chat",
        href: "/dashboard/chat",
        icon: <HiOutlineChatBubbleOvalLeft />,
      },
      {
        id: "trash",
        name: "Trash",
        href: "/dashboard/trash",
        icon: <HiOutlineTrash />,
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="box-jumping-loader"></div>
      </div>
    );
  }

  if (!user) {
    router.replace("/signin");
    return <div>Not Authorized</div>;
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-100 dark:bg-zinc-900">
      <Header user={user} />
      <Sidebar menu={mainMenu} compact={isCompactSidebar} />
      <main
        className={clsx(
          "relative mt-14",
          isCompactSidebar ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

const Header = ({ user }: { user: User }) => (
  <header
    className={clsx(
      "fixed top-0 left-0 right-0 z-30 h-14 border-b border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900"
    )}
  >
    <div className="h-full px-4">
      <div className="relative flex h-full items-center">
        <Link href="/dashboard" className="mr-auto text-xl font-bold">
          Draftify
        </Link>
        <nav className="max-lg:hidden">
          <a href="/help" className="ml-8">
            Help
          </a>
          <a href="/pricing" className="ml-8">
            Upgrade
          </a>
        </nav>
        <button className="-my-2.5 mr-6 inline-flex items-center justify-center rounded-lg bg-slate-900 py-2.5 px-4 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 lg:hidden">
          <HiOutlinePlus className="mr-2 -ml-1 text-xl" />
          New Project
        </button>
        <button className="-m-2.5 p-2.5 text-2xl lg:hidden">
          <HiOutlineBars3 />
        </button>
        <div className="ml-8 border-l border-slate-200 pl-8 dark:border-zinc-800 max-lg:hidden">
          <UserDropdown user={user} />
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = ({
  menu,
  compact,
}: {
  menu: {
    id: string;
    name: string;
    href: string;
    icon: ReactNode;
  }[];
  compact: boolean;
}) => {
  const router = useRouter();

  return (
    <aside
      className={clsx(
        "fixed left-0 top-14 bottom-0 z-30 flex flex-col overflow-hidden border-r border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900 max-lg:hidden",
        compact ? "w-16" : "w-64"
      )}
    >
      <header className={compact ? "mx-auto py-4" : "p-4"}>
        <button
          className={clsx(
            "flex w-full items-center justify-center rounded-lg border border-slate-300 hover:border-slate-400 dark:border-zinc-700 dark:hover:border-zinc-400",
            compact ? "h-10 w-10" : "px-4 py-2.5 text-sm font-medium"
          )}
        >
          <HiOutlinePlus className={compact ? "text-2xl" : "mr-2 text-xl"} />
          {!compact && "New Project"}
        </button>
      </header>

      <div
        className={clsx(
          compact
            ? "flex flex-col items-center space-y-4 overflow-y-auto"
            : "space-y-4 p-4"
        )}
      >
        <nav className="space-y-px">
          {menu.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                "flex items-center rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 [&.active]:bg-slate-200 dark:[&.active]:bg-zinc-800",
                compact ? "h-10 w-10 justify-center" : "py-2 px-4",
                { active: router.pathname.startsWith(item.href) }
              )}
            >
              <span className={clsx(compact ? "text-xl" : "mr-4 text-xl")}>
                {item.icon}
              </span>
              {!compact && item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};
