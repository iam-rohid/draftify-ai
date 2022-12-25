import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";
import { useCreateProjectMutation } from "@/hooks/mutations/useCreateProjectMutation";
import { useTemplatesQuery } from "@/hooks/queries/useTemplatesQuery";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Template } from "@/models/template";
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
    (template: Template) => {
      if (!user) return;
      createProjectMutate(
        {
          userId: user.uid,
          template,
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
                template={template}
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
