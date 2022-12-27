import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { MdMoreVert } from "react-icons/md";
import {
  HiOutlineDocument,
  HiOutlineFolder,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useUpdateProjectMutation } from "@/hooks/mutations/useUpdateProjectMutation";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

const ProjectCard = ({
  project,
}: {
  project: {
    id: string;
    name: string | undefined;
    createdAt: string;
    updatedAt: string | undefined;
    description: string | undefined;
  };
}) => {
  const { user } = useAuth();
  const time = useMemo(
    () =>
      !!project.updatedAt
        ? `Edited ${formatDistanceToNow(new Date(project.updatedAt), {
            addSuffix: true,
          })}`
        : !!project.createdAt
        ? `Created ${formatDistanceToNow(new Date(project.createdAt), {
            addSuffix: true,
          })}`
        : null,
    [project]
  );
  const { mutate } = useUpdateProjectMutation();
  const queryClient = useQueryClient();
  const moveToTrash = useCallback(async () => {
    if (!user) return;
    mutate(
      {
        projectId: project.id,
        userId: user.id,
        data: {
          isDeleted: true,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["projects", user.id]);
        },
      }
    );
  }, [mutate, project.id, queryClient, user]);

  return (
    <div className="cursor-pointer rounded-xl bg-white shadow-sm hover:shadow-lg dark:bg-zinc-800 dark:hover:bg-zinc-700/70">
      <Link
        href={`/dashboard/projects/${project.id}`}
        className="flex flex-col justify-start p-4"
      >
        <span className="mb-2 inline-block text-3xl">
          <HiOutlineDocument />
        </span>
        <h3 className="mb-1.5 font-medium">{project.name || "Untitled"}</h3>
        <p className="text-sm font-light text-slate-600 dark:text-zinc-300">
          {project.description || "No description"}
        </p>
      </Link>
      <div className="flex w-full items-center overflow-hidden">
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="flex-1 overflow-hidden p-4"
        >
          {!!time && (
            <p className="truncate text-xs font-light text-slate-600 dark:text-zinc-300">
              {time}
            </p>
          )}
        </Link>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="mr-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-700">
              <MdMoreVert className="text-xl" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="absolute right-0 z-40 w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <DropdownMenu.Item asChild>
                <button
                  className="flex w-full items-center rounded-lg px-4 py-1.5 outline-none focus:bg-slate-100 dark:focus:bg-zinc-800"
                  onClick={() => alert("Not Implemented")}
                >
                  <HiOutlineFolder className="mr-2 -ml-1 text-xl" />
                  Move to Folder
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <button
                  className="flex w-full items-center rounded-lg px-4 py-1.5 outline-none focus:bg-slate-100 dark:focus:bg-zinc-800"
                  onClick={() => alert("Not Implemented")}
                >
                  <HiOutlinePencilSquare className="mr-2 -ml-1 text-xl" />
                  Rename
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <button
                  className="flex w-full items-center rounded-lg px-4 py-1.5 outline-none hover:bg-slate-100 dark:hover:bg-zinc-800"
                  onClick={moveToTrash}
                >
                  <HiOutlineTrash className="mr-2 -ml-1 text-xl" />
                  Move to Trash
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default ProjectCard;

// const DeleteProjectDialog: FC<
//   PropsWithChildren<{ projectId: string; name?: string }>
// > = ({ children, projectId, name }) => {
//   return (
//     <AlertDialog.Root>
//       <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
//       <AlertDialog.Portal>
//         <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
//         <AlertDialog.Content className="fixed top-24 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-2xl bg-white p-4 shadow-xl dark:bg-zinc-800">
//           <AlertDialog.Title className="mb-4 text-xl font-bold">
//             Are you absolutely sure?
//           </AlertDialog.Title>
//           <AlertDialog.Description className="mb-4 text-slate-600 dark:text-zinc-300">
//             This action cannot be undone. This will permanently delete this proje.
//           </AlertDialog.Description>
//           <div className="flex justify-end gap-2">
//             <AlertDialog.Cancel asChild>
//               <button className="rounded-lg px-4 py-2 font-medium hover:bg-slate-200 dark:hover:bg-zinc-700">
//                 Cancel
//               </button>
//             </AlertDialog.Cancel>
//             <AlertDialog.Action asChild>
//               <button className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600">
//                 Yes, delete project
//               </button>
//             </AlertDialog.Action>
//           </div>
//         </AlertDialog.Content>
//       </AlertDialog.Portal>
//     </AlertDialog.Root>
//   );
// };
