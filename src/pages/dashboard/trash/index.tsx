import ProjectCard from "@/components/ProjectCard";
import { useProjectsQuery } from "@/hooks/queries/useProjectsQuery";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/providers/AuthProvider";
import { CustomNextPage } from "@/types/next";

const Trash: CustomNextPage = () => {
  const { user } = useAuth();
  const { data: projects, isLoading } = useProjectsQuery({
    userId: user!.id,
    filter: {
      isDeleted: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12 p-4 md:p-6">
      <section id="projects">
        <div className="mb-4 flex h-10 items-center">
          <h2 className="mr-auto text-xl font-bold">Projects</h2>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : projects?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
          </div>
        ) : (
          <div>You don&apos;t have any project</div>
        )}
      </section>
    </div>
  );
};

export default Trash;

Trash.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
