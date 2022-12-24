import UserDropdown from "@/components/UserDropdown";
import { useAuth } from "@/providers/AuthProvider";
import { User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, ReactNode, useMemo } from "react";
import {
  HiHome,
  HiSquares2X2,
  HiPlus,
  HiCube,
  HiTrash,
  HiBars3,
} from "react-icons/hi2";

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const mainMenu = useMemo(
    () => [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/dashboard",
        icon: <HiHome />,
      },
      {
        id: "templates",
        name: "Templates",
        href: "/dashboard/templates",
        icon: <HiSquares2X2 />,
      },
      {
        id: "playground",
        name: "Playground",
        href: "/dashboard/playground",
        icon: <HiCube />,
      },
      {
        id: "trash",
        name: "Trash",
        href: "/dashboard/trash",
        icon: <HiTrash />,
      },
    ],
    []
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.replace("/signin");
    return <div>Not Authorized</div>;
  }

  return (
    <>
      <Header user={user} />
      <Sidebar menu={mainMenu} />
      <main className="ml-64 mt-14">{children}</main>
    </>
  );
};

export default DashboardLayout;

const Header = ({ user }: { user: User }) => (
  <header className="fixed top-0 left-0 right-0 z-30 h-14 border-b border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
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
          <HiPlus className="mr-2 -ml-1 text-xl" />
          New Project
        </button>
        <button className="-m-2.5 p-2.5 text-2xl lg:hidden">
          <HiBars3 />
        </button>
        <div className="ml-8 border-l border-slate-100 pl-8 dark:border-zinc-800 max-lg:hidden">
          <UserDropdown user={user} />
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = ({
  menu,
}: {
  menu: {
    id: string;
    name: string;
    href: string;
    icon: ReactNode;
  }[];
}) => (
  <aside className="fixed left-0 top-14 bottom-0 z-30 w-64 border-r border-slate-100 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 max-lg:hidden">
    <div className="my-6 space-y-6 px-4">
      <button className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:border-slate-300 dark:border-zinc-700 dark:hover:border-zinc-600">
        <HiPlus className="mr-2 text-xl" />
        New Project
      </button>

      <nav>
        {menu.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center rounded-lg py-2 px-4 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <span className="mr-4 text-xl">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  </aside>
);
