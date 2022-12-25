import ProjectCard from "@/components/ProjectCard";
import TemplateCard from "@/components/TemplateCard";
import { useCreateProjectMutation } from "@/hooks/mutations/useCreateProjectMutation";
import { useProjectsQuery } from "@/hooks/queries/useProjectsQuery";
import { useTemplatesQuery } from "@/hooks/queries/useTemplatesQuery";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Template } from "@/models/template";
import { useAuth } from "@/providers/AuthProvider";
import { CustomNextPage } from "@/types/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { HiArrowRight } from "react-icons/hi2";

const Dashboard: CustomNextPage = () => {
  const { user } = useAuth();
  const { data: templates, isLoading: isTemplatesLoading } =
    useTemplatesQuery();
  const { data: projects, isLoading } = useProjectsQuery({
    userId: user!.uid,
  });
  const { mutate: createProjectMutate } = useCreateProjectMutation();
  const router = useRouter();

  const handleCreateProjectFromTemplate = useCallback(
    (template: Template) => {
      if (!user) return;
      createProjectMutate(
        {
          userId: user.uid,
          templateId: template.id,
        },
        {
          onSuccess(data) {
            router.push(`/dashboard/projects/${data.id}`);
          },
        }
      );
    },
    [createProjectMutate, user, router]
  );

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12 p-4 md:p-6">
      <section id="get-started">
        <div className="mb-4 flex h-10 items-center">
          <h2 className="mr-auto text-xl font-bold">Get Started</h2>
          <Link
            href="/dashboard/templates"
            className="flex items-center font-medium"
          >
            All Templates
            <HiArrowRight className="ml-2 text-xl" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {isTemplatesLoading ? (
            <p>Loading...</p>
          ) : (
            templates
              ?.slice(0, 4)
              .map((template) => (
                <TemplateCard
                  template={template}
                  key={template.id}
                  onClick={handleCreateProjectFromTemplate}
                />
              ))
          )}
        </div>
      </section>
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

export default Dashboard;

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
