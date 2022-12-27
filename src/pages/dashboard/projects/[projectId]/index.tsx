import { useCreateCompletionMutation } from "@/hooks/mutations/useCreateCompletionMutation";
import { useProjectQuery } from "@/hooks/queries/useProjectQuery";
import { useTemplateQuery } from "@/hooks/queries/useTemplateQuery";
import ProjectLayout from "@/layouts/ProjectLayout";
import { useAuth } from "@/providers/AuthProvider";
import { CustomNextPage } from "@/types/next";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import TextCompletionCard from "@/components/TextCompletionCard";
import { nanoid } from "nanoid";
import { useUpdateProjectMutation } from "@/hooks/mutations/useUpdateProjectMutation";
import dynamic from "next/dynamic";
import { type RemirrorJSON } from "remirror";
import { MdAutorenew, MdCheck, MdError } from "react-icons/md";

const RemirrorEditor = dynamic(import("@/remirror-editor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Project: CustomNextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProjectQuery(user!.uid, router.query["projectId"] as string);
  const {
    mutate: saveProjectMutate,
    status: savingStatus,
    error: savingError,
  } = useUpdateProjectMutation();
  const [savedProject, setSavedProject] = useState<{
    name?: string;
    content?: RemirrorJSON;
  }>({
    name: undefined,
    content: undefined,
  });
  const [content, setContent] = useState<RemirrorJSON | undefined>(undefined);
  const [nameText, setNameText] = useState<string | undefined>(undefined);
  const [lookForChanges, setLookForChanges] = useState(false);
  const isOldData = useMemo(
    () =>
      lookForChanges &&
      (JSON.stringify(savedProject.content) !== JSON.stringify(content) ||
        savedProject?.name != nameText),
    [
      lookForChanges,
      savedProject.content,
      savedProject?.name,
      content,
      nameText,
    ]
  );

  useEffect(() => {
    if (project) {
      const content = project.content || undefined;
      const name = project.name;
      setSavedProject({
        name,
        content,
      });
      setContent(content);
      setNameText(name);
      setLookForChanges(true);
    }
  }, [project]);

  const handleSave = useCallback(
    (data: { name?: string; content?: any }) => {
      if (!project || !user) return;
      if (savingStatus === "loading") return;
      if (!isOldData) return;
      saveProjectMutate(
        {
          projectId: project.id,
          userId: user.uid,
          data,
        },
        {
          onSuccess: () => {
            setSavedProject(data);
          },
        }
      );
    },
    [project, user, savingStatus, isOldData, saveProjectMutate]
  );

  useEffect(() => {
    const timeout = setTimeout(
      () =>
        handleSave({
          content: content,
          name: nameText,
        }),
      500
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [handleSave, content, nameText]);

  const handleWindowLoad = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    return (event.returnValue =
      "There are some unsaved changes. Are you sure you want to leave this page?");
  };

  useEffect(() => {
    if (isOldData) {
      window.addEventListener("beforeunload", handleWindowLoad, {
        capture: true,
      });
    }

    return () => {
      window.removeEventListener("beforeunload", handleWindowLoad, {
        capture: true,
      });
    };
  }, [isOldData]);

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
          <input
            type="text"
            value={nameText}
            placeholder="Untitled"
            onChange={(e) => setNameText(e.currentTarget.value)}
            className="h-full w-full flex-1 bg-transparent outline-none"
          />
          <SaveStatus status={savingStatus} />
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-12">
          <div className="mx-auto max-w-2xl">
            <FormView templateId={project.templateId} />
          </div>
        </div>
      </div>
      <div className="h-full w-px bg-slate-100 dark:bg-zinc-800 max-md:hidden" />
      <div className="flex h-full flex-1 overflow-hidden lg:max-w-[48rem]">
        <RemirrorEditor
          placeholder="Start typing here..."
          initialContent={project.content}
          onChange={setContent}
        />
      </div>
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
                      rows={input.rows || 4}
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

const SaveStatus = ({
  status,
}: {
  status: "idle" | "old" | "error" | "loading" | "success";
}) => {
  return (
    <div className="flex items-center rounded-md px-3 py-1.5 text-sm">
      {status === "error" ? (
        <>
          <MdError className="mr-1.5 -ml-1 text-xl" />
          <p>Failed to save</p>
        </>
      ) : status === "loading" ? (
        <>
          <MdAutorenew className="mr-1.5 -ml-1 text-xl" />
          <p>Saving...</p>
        </>
      ) : status === "success" ? (
        <>
          <MdCheck className="mr-1.5 -ml-1 text-xl" />
          <p>Saved</p>
        </>
      ) : status === "old" ? (
        <>
          <MdAutorenew className="mr-1.5 -ml-1 text-xl" />
          <p>Changes Detected</p>
        </>
      ) : (
        <>
          <MdCheck className="mr-1.5 -ml-1 text-xl" />
          <p>Idle</p>
        </>
      )}
    </div>
  );
};
