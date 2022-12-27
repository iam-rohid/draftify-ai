import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HiArrowLeftOnRectangle,
  HiCog,
  HiSquares2X2,
  HiUser,
} from "react-icons/hi2";
import Link from "next/link";
import { useSignOutMutation } from "@/hooks/mutations/useSignOutMutation";
import { User } from "@supabase/supabase-js";

const UserDropdown = ({ user }: { user: User }) => {
  const { mutate: signOut } = useSignOutMutation();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-2xl hover:bg-sky-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
        <HiUser />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="absolute right-0 z-40 w-[200px] overflow-hidden rounded-lg border border-slate-100 bg-white pb-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <DropdownMenu.Item asChild>
            <Link
              href="/settings/account"
              className="flex items-center px-4 py-2 outline-none focus:bg-slate-100 dark:focus:bg-zinc-800"
            >
              <span className="mr-2 text-xl">
                <HiUser />
              </span>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs leading-3 text-slate-600 dark:text-zinc-300">
                  Account
                </p>
                <p className="truncate text-sm">
                  {user.email || "Unknown User"}
                </p>
              </div>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-2 h-px w-full bg-slate-100 dark:bg-zinc-800" />
          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-sm outline-none focus:bg-slate-100 dark:focus:bg-zinc-800"
            >
              <HiSquares2X2 className="mr-2 text-xl" />
              Dashbaord
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm outline-none focus:bg-slate-100 dark:focus:bg-zinc-800"
            >
              <HiCog className="mr-2 text-xl" />
              Settings
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-2 h-px w-full bg-slate-100 dark:bg-zinc-800" />

          <DropdownMenu.Item asChild>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center px-4 py-2 text-sm outline-none focus:bg-slate-100 dark:focus:bg-zinc-800"
            >
              <HiArrowLeftOnRectangle className="mr-2 text-xl" />
              Log Out
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default UserDropdown;
