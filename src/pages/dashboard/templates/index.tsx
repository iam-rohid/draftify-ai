import TemplateCard from "@/components/TemplateCard";
import { useCreateProjectMutation } from "@/hooks/mutations/useCreateProjectMutation";
import { useTemplatesQuery } from "@/hooks/queries/useTemplatesQuery";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/providers/AuthProvider";
import { CustomNextPage } from "@/types/next";
import { useRouter } from "next/router";
import { useCallback } from "react";

const Templates: CustomNextPage = () => {
  const { user } = useAuth();
  const { data: templates, isLoading: isTemplatesLoading } =
    useTemplatesQuery();
  const { mutate: createProjectMutate, isLoading: isCreatingProject } =
    useCreateProjectMutation();
  const router = useRouter();

  const handleCreateProjectFromTemplate = useCallback(
    (templateId: string) => {
      if (!user) return;
      createProjectMutate(
        {
          userId: user.id,
          templateId,
        },
        {
          onSuccess(projectId) {
            router.push(`/dashboard/projects/${projectId}`);
          },
        }
      );
    },
    [createProjectMutate, user, router]
  );

  return (
    <div className="mx-auto w-full max-w-screen-xl p-4 md:p-6">
      <section id="templates">
        <div className="mb-4 flex h-10 items-center">
          <h2 className="mr-auto text-xl font-bold">Templates</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {isTemplatesLoading ? (
            <p>Loading...</p>
          ) : (
            templates?.map((template) => (
              <TemplateCard
                templateId={template.id}
                name={template.name}
                description={template.description}
                key={template.id}
                onClick={handleCreateProjectFromTemplate}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Templates;

Templates.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
