import UserDropdown from "@/components/UserDropdown";
import { useAuth } from "@/providers/AuthProvider";
import { User } from "firebase/auth";
import Link from "next/link";
import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";

const HomeLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading: isUserLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.documentElement.classList.toggle("overflow-hidden", sidebarOpen);

    if (sidebarOpen) {
      window.addEventListener("resize", onResize);
    }
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [sidebarOpen]);

  return (
    <>
      <Header
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={(open) => setSidebarOpen(open)}
        user={user}
        isLoading={isUserLoading}
      />

      <MobileSidebar
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={(open) => setSidebarOpen(open)}
        user={user}
      />

      {children}
    </>
  );
};

export default HomeLayout;

const Header = ({
  sidebarOpen,
  onSidebarOpenChange,
  user,
  isLoading,
}: {
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
  user: User | null | undefined;
  isLoading: boolean;
}) => (
  <header className="relative h-20 w-full flex-none border-b border-slate-100 bg-white text-sm font-medium leading-6 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="mx-auto h-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      <div className="relative flex h-full items-center">
        <Link href="/" className="mr-auto text-xl font-bold">
          Draftify
        </Link>
        <nav className="max-lg:hidden">
          <Link href="/pricing" className="ml-8">
            Pricing
          </Link>
          <Link href="/examples" className="ml-8">
            Examples
          </Link>
        </nav>
        <button
          className="-m-2.5 p-2.5 text-2xl lg:hidden"
          onClick={() => onSidebarOpenChange(true)}
        >
          {sidebarOpen ? <HiXMark /> : <HiBars3 />}
        </button>
        <div className="lg:border-slate-900/15 hidden lg:ml-8 lg:flex lg:items-center lg:border-l lg:pl-8">
          {isLoading ? (
            <p>Loading...</p>
          ) : user ? (
            <>
              <Link href="/dashboard" className="mr-8">
                Dashboard
              </Link>
              <UserDropdown user={user} />
            </>
          ) : (
            <>
              <Link href="/signin">Sign in</Link>
              <Link
                href="/join"
                className="-my-2.5 ml-8 inline-flex items-center justify-center rounded-lg bg-slate-900 py-2.5 px-4 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  </header>
);

const MobileSidebar = ({
  sidebarOpen,
  onSidebarOpenChange,
  user,
}: {
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
  user: User | null | undefined;
}) => {
  const handleLogOut = useCallback(() => {}, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-30 lg:hidden [&.active]:pointer-events-auto [&.active_.sdiebar-backdrop]:opacity-100 [&.active_.sidebar]:right-0 ${
        sidebarOpen ? "active" : "inactive"
      }`}
    >
      <button
        className="sdiebar-backdrop fixed inset-0 bg-black/50 opacity-0 transition-[opacity] duration-300"
        onClick={() => onSidebarOpenChange(false)}
      />
      <aside className="sidebar absolute top-0 bottom-0 -right-full w-full max-w-xs overflow-y-auto bg-white transition-[right] duration-300 dark:bg-zinc-900">
        <header className="flex items-center border-b border-gray-100 py-6 px-4 dark:border-zinc-800">
          <Link
            href="/"
            className="mr-auto text-xl font-bold"
            onClick={() => onSidebarOpenChange(false)}
          >
            Draftify
          </Link>

          <button
            className="-m-2.5 p-2.5 lg:hidden"
            onClick={() => onSidebarOpenChange(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <div className="m-4">
          {user ? (
            <>
              <Link
                className="flex items-center py-3"
                onClick={() => onSidebarOpenChange(false)}
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="flex items-center py-3"
                onClick={() => onSidebarOpenChange(false)}
                href="/settings/account"
              >
                Account
              </Link>
              <Link
                className="flex items-center py-3"
                onClick={() => onSidebarOpenChange(false)}
                href="/settings"
              >
                Settings
              </Link>
              <button
                className="flex w-full items-center py-3"
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                className="flex items-center justify-center py-3"
                onClick={() => onSidebarOpenChange(false)}
                href="/signin"
              >
                Sign in
              </Link>
              <Link
                className="mt-2 flex w-full items-center justify-center rounded-lg bg-slate-900 py-3 px-4 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                href="/join"
                onClick={() => onSidebarOpenChange(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="h-px w-full bg-gray-100  dark:bg-zinc-800" />

        <nav className="m-4">
          <Link
            className="flex items-center py-3"
            onClick={() => onSidebarOpenChange(false)}
            href="#features"
          >
            Features
          </Link>
          <Link
            className="flex items-center py-3"
            onClick={() => onSidebarOpenChange(false)}
            href="/examples"
          >
            Examples
          </Link>
          <Link
            className="flex items-center py-3"
            onClick={() => onSidebarOpenChange(false)}
            href="/pricing"
          >
            Pricing
          </Link>
        </nav>
      </aside>
    </div>
  );
};
