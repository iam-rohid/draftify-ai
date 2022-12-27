import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { MdMoreVert } from "react-icons/md";
import { HiOutlineDocument } from "react-icons/hi2";

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
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="rounded-xl border border-slate-200 bg-slate-50 shadow-md hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
    >
      <div className="flex flex-col justify-start p-4">
        <span className="mb-2 inline-block text-3xl">
          <HiOutlineDocument />
        </span>
        <h3 className="mb-1.5 font-medium">{project.name || "Untitled"}</h3>
        <p className="text-sm font-light text-slate-600 dark:text-zinc-300">
          {project.description || "No description"}
        </p>
      </div>
      <div className="flex w-full items-center overflow-hidden border-t border-slate-200 p-1 dark:border-zinc-700">
        <div className="flex-1 overflow-hidden p-1.5">
          {!!time && (
            <p className="truncate text-xs font-light text-slate-600 dark:text-zinc-300">
              {time}
            </p>
          )}
        </div>
        <button className="rounded-lg p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-700">
          <MdMoreVert className="text-xl" />
        </button>
      </div>
    </Link>
  );
};

export default ProjectCard;
