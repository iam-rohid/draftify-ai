import {
  useCreateNewConversationMutation,
  useGetConversationsList,
} from "@/hooks/conversations";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/providers/AuthProvider";
import { CustomNextPage } from "@/types/next";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

const Chat: CustomNextPage = () => {
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

  const handleCreateConversation = useCallback(() => {
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
          router.push(`/dashboard/chat/${conversation.id}`);
        },
      }
    );
  }, [createNewConversationMutate, router]);

  useEffect(() => {
    if (conversations && conversations.length) {
      router.push(`/dashboard/chat/${conversations[0].id}`);
    }
  }, [conversations, router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <p>{error instanceof Error ? error.message : "Something went wrong!"}</p>
    );
  }

  if (conversations && conversations.length) {
    return <p>Redirecting....</p>;
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center overflow-hidden text-center">
      <p className="text-2xl font-bold">
        You don&apos;t have any conversations
      </p>
      <button
        className="mt-4 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-600"
        onClick={handleCreateConversation}
      >
        {isCreatingNewConversation ? "Creating..." : "Create New Conversation"}
      </button>
    </div>
  );
};

export default Chat;

Chat.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
