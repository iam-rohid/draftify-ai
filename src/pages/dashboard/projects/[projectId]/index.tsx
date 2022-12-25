import { useCreateCompletionMutation } from "@/hooks/mutations/useCreateCompletionMutation";
import { useProjectQuery } from "@/hooks/queries/useProjectQuery";
import { useTemplateQuery } from "@/hooks/queries/useTemplateQuery";
import ProjectLayout from "@/layouts/ProjectLayout";
import { useAuth } from "@/providers/AuthProvider";
import { CustomNextPage } from "@/types/next";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import TextCompletionCard from "@/components/TextCompletionCard";
import { nanoid } from "nanoid";

const Project: CustomNextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProjectQuery(user!.uid, router.query["projectId"] as string);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !project) {
    return (
      <p>{error instanceof Error ? error.message : "Something went wrong!"}</p>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="flex flex-1 flex-col">
        <header className="flex h-12 w-full items-center border-b border-slate-100 px-4 dark:border-zinc-800">
          <p>{project.name ?? "Untitled"}</p>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-12">
          <FormView templateId={project.templateId} />
        </div>
      </div>
      <div className="h-full w-px bg-slate-100 dark:bg-zinc-800 max-md:hidden" />
      <Editor defaultValue={project.body} />
    </div>
  );
};

export default Project;

Project.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

const FormView = ({ templateId }: { templateId: string }) => {
  const [completions, setCompletions] = useState<
    {
      id: string;
      text: string;
      createdAt: string;
    }[]
  >([]);

  const {
    data: template,
    isLoading,
    isError,
    error,
  } = useTemplateQuery(templateId);
  const { mutate: generateMutate, isLoading: isGenerating } =
    useCreateCompletionMutation();

  const handleRemoveCompletion = useCallback((id: string) => {
    console.log({ id });
    setCompletions((completions) => completions.filter((c) => c.id !== id));
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!template) return;

      const formData = new FormData(event.currentTarget);
      generateMutate(
        {
          formData: formData,
          template: template,
        },
        {
          onSuccess: (data) => {
            if (!data.choices) return;
            setCompletions((completions) => [
              ...data.choices.map((choice) => ({
                id: nanoid(),
                createdAt: new Date().toISOString(),
                text: choice,
              })),
              ...completions,
            ]);
          },
        }
      );
    },
    [generateMutate, template]
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <p>{error instanceof Error ? error.message : "Something went wrong!"}</p>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">{template.name}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-8 space-y-4">
          {template.inputs.map((input) => {
            switch (input.type) {
              case "text":
                return (
                  <div key={input.id}>
                    <label
                      htmlFor={input.id}
                      className="text-sm text-slate-600 dark:text-zinc-300"
                    >
                      {input.label}
                    </label>
                    <input
                      id={input.id}
                      name={input.id}
                      defaultValue={input.defaultValue}
                      type="text"
                      className="mt-2 block w-full rounded-lg bg-transparent px-4 py-2.5 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 dark:ring-zinc-700"
                      placeholder={input.placeholder}
                      minLength={input.minLength}
                      maxLength={input.maxLength}
                      required={input.isRequired}
                    />
                  </div>
                );
              case "textarea":
                return (
                  <div key={input.id}>
                    <label
                      htmlFor={input.id}
                      className="text-sm text-slate-600 dark:text-zinc-300"
                    >
                      {input.label}
                    </label>
                    <textarea
                      id={input.id}
                      name={input.id}
                      defaultValue={input.defaultValue}
                      className="mt-2 block w-full rounded-lg bg-transparent p-4 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 dark:ring-zinc-700"
                      placeholder={input.placeholder}
                      minLength={input.minLength}
                      maxLength={input.maxLength}
                      rows={input.rows ?? 4}
                      required={input.isRequired}
                    />
                  </div>
                );
              default:
                return <div key={input.id}></div>;
            }
          })}
        </div>

        <button
          type="submit"
          className="flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white hover:bg-slate-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isGenerating ? "Generating" : "Generate Content"}
          <HiArrowRight className="ml-2 -mr-1 text-xl" />
        </button>
      </form>

      <div className="mt-16">
        <div className="mb-4 h-10">
          <h3 className="text-xl font-semibold">Results</h3>
        </div>
        <div className="space-y-4 md:space-y-6">
          {completions.map((completion, i) => (
            <TextCompletionCard
              key={i}
              completion={completion}
              onRemove={handleRemoveCompletion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Editor = ({
  value,
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) => {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-12 w-full items-center border-b border-slate-100 px-4 dark:border-zinc-800"></header>
      <textarea
        className="flex-1 resize-none bg-transparent p-4 outline-none"
        placeholder="Start typing..."
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.value)}
      />
    </div>
  );
};
