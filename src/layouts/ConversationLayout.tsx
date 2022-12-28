import { useCallback } from "react";
import {
  useCreateNewConversationMutation,
  useGetConversationsList,
} from "@/hooks/conversations";
import { useAuth } from "@/providers/AuthProvider";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";
import {
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlinePlus,
} from "react-icons/hi2";
import DashboardLayout from "./DashboardLayout";
import { useQueryClient } from "@tanstack/react-query";

const ConversationLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <DashboardLayout compactSidebar>
      <div className="h-[calc(100vh-3.5rem)] overflow-hidden">
        <Sidebar />
        <div className="ml-72">{children}</div>
      </div>
    </DashboardLayout>
  );
};

export default ConversationLayout;

const Sidebar = () => {
  const { user } = useAuth();
  const {
    mutate: createNewConversationMutate,
    isLoading: isCreatingNewConversation,
  } = useCreateNewConversationMutation();
  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useGetConversationsList({
    userId: user!.id,
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleCreateConversation = useCallback(() => {
    if (!user) return;
    createNewConversationMutate(
      {
        settings: {
          model: "text-davinci-003",
          top_p: 1,
          temperature: 0.9,
          presence_penalty: 0.6,
          best_of: 1,
          stop: ["Human:", "AI:"],
          max_tokens: 200,
        },
      },
      {
        onSuccess: (conversation) => {
          queryClient.setQueryData(
            ["get-coversations", user.id],
            [
              ...(conversations || []),
              {
                ...conversation,
              },
            ]
          );
          queryClient.invalidateQueries(["get-coversations", user.id]);
          router.push(`/dashboard/chat/${conversation.id}`);
        },
      }
    );
  }, [conversations, createNewConversationMutate, queryClient, router, user]);

  return (
    <aside className="absolute left-0 top-0 bottom-0 flex w-72 flex-col overflow-hidden overflow-y-auto border-r border-slate-200 dark:border-zinc-800">
      <header className="p-4">
        <button
          className={clsx(
            "flex w-full items-center justify-center rounded-lg border border-slate-300 hover:border-slate-400 dark:border-zinc-700 dark:hover:border-zinc-400",
            "px-4 py-2.5 text-sm font-medium"
          )}
          onClick={handleCreateConversation}
        >
          <HiOutlinePlus className="mr-2 text-xl" />
          {isCreatingNewConversation ? "Creating..." : "New Conversation"}
        </button>
      </header>
      <div className="w-full flex-1 space-y-px p-4">
        {isLoading ? (
          <p>loading...</p>
        ) : (
          conversations?.map((conversation) => (
            <Link
              href={`/dashboard/chat/${conversation.id}`}
              key={conversation.id}
              className={clsx(
                "flex w-full items-center overflow-hidden truncate rounded-lg px-4 py-2 hover:bg-slate-200 dark:hover:bg-zinc-800",
                {
                  "bg-slate-200 dark:bg-zinc-800":
                    router.asPath === `/dashboard/chat/${conversation.id}`,
                }
              )}
            >
              <span className="mr-4 text-xl">
                <HiOutlineChatBubbleOvalLeftEllipsis />
              </span>
              {conversation.name ?? "Untitled Conversation"}
            </Link>
          ))
        )}
      </div>
    </aside>
  );
};
