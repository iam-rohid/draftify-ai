import TemplateRow from "@/components/TemplateRow";
import { useTemplatesQuery } from "@/hooks/queries/useTemplatesQuery";
import { FC, PropsWithChildren } from "react";
import DashboardLayout from "./DashboardLayout";

const ProjectLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: templates, isLoading: isTemplatesLoading } =
    useTemplatesQuery();
  return (
    <DashboardLayout compactSidebar>
      <aside className="absolute left-0 top-14 bottom-0 w-64 overflow-y-auto border-r border-slate-100 dark:border-zinc-800 lg:left-16">
        <div className="p-4">
          <div className="mb-2">
            <p className="text-xl font-semibold">Templates</p>
          </div>
          <div className="space-y-2">
            {isTemplatesLoading ? (
              <p>loading...</p>
            ) : (
              templates?.map((template) => (
                <TemplateRow
                  key={template.id}
                  templateId={template.id}
                  name={template.name}
                  description={template.description}
                />
              ))
            )}
          </div>
        </div>
      </aside>
      <div className="ml-64">{children}</div>
    </DashboardLayout>
  );
};

export default ProjectLayout;
