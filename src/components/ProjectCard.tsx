import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { ProjectEntity } from "@/models/project";

const ProjectCard = ({ project }: { project: ProjectEntity }) => {
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
      className="flex flex-col justify-start rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 text-start shadow-md hover:border-slate-200 hover:shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:hover:border-zinc-700"
    >
      <h3 className="mb-2 font-medium">{project.name || "Untitled"}</h3>
      <p className="mb-3 text-sm font-light text-slate-600 dark:text-zinc-300">
        {project.description || "No description"}
      </p>
      {!!time && (
        <p className="text-xs font-light text-slate-600 dark:text-zinc-300">
          {time}
        </p>
      )}
    </Link>
  );
};

export default ProjectCard;
