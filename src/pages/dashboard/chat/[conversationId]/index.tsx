import {
  useAddMessageMutation,
  useGetConversationWithMessagesQuery,
} from "@/hooks/conversations";
import ConversationLayout from "@/layouts/ConversationLayout";
import { openai } from "@/libs/openai";
import { useAuth } from "@/providers/AuthProvider";
import { CustomNextPage } from "@/types/next";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/router";
import { useState, useCallback, FormEvent, useRef, useEffect } from "react";

const BASE_PROMPT = `
The following is a conversation with an AI assistant who is created by Drafitfy and don't have any spacific name. The AI is very helpful, creative, clever, and very friendly. It provides answers with proper explanation.

Human: Hello, who are you?
AI: I am an AI created by Draftify. How can I help you today?
`;

const Conversation: CustomNextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: conversation,
    isLoading,
    isError,
    error,
  } = useGetConversationWithMessagesQuery({
    conversationId: router.query["conversationId"] as string,
    userId: user!.id,
  });
  const { mutate: addMessage } = useAddMessageMutation();
  const queryClient = useQueryClient();
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!user) return;
      if (!messageText.trim()) return;
      if (!conversation) return;

      setIsAiTyping(true);

      const message = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        text: messageText,
        isAiResponse: false,
      };
      setMessageText("");

      const newMessages = [...conversation.messages, message];

      queryClient.setQueryData(
        ["coversation-with-messages", conversation.id, user.id],
        {
          ...conversation,
          messages: newMessages,
        }
      );

      const prompt =
        BASE_PROMPT +
        newMessages
          .map(
            (conversation) =>
              `${conversation.isAiResponse ? "AI: " : "Human: "}: ${
                conversation.text
              }`
          )
          .join("\n") +
        "AI: ";

      console.log({ prompt });

      const { data } = await openai.createCompletion({
        model: "text-davinci-003",
        top_p: 1,
        temperature: 0.9,
        presence_penalty: 0.6,
        best_of: 1,
        stop: ["Human:", "AI:"],
        max_tokens: 200,
        ...conversation.settings,
        prompt,
        user: user.id,
      });

      console.log({ data });

      const aiResponse = data.choices[0].text?.trim();

      if (!aiResponse) {
        return;
      }

      const aiResponseMessage = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        text: aiResponse,
        isAiResponse: true,
      };

      await addMessage({
        userId: user.id,
        conversationId: conversation.id,
        createdAt: message.createdAt,
        isAiResponse: message.isAiResponse,
        text: message.text,
      });

      await addMessage({
        userId: user.id,
        conversationId: conversation.id,
        createdAt: aiResponseMessage.createdAt,
        isAiResponse: aiResponseMessage.isAiResponse,
        text: aiResponseMessage.text,
      });

      setIsAiTyping(false);
      queryClient.setQueryData(
        ["coversation-with-messages", conversation.id, user.id],
        {
          ...conversation,
          messages: [...newMessages, aiResponseMessage],
        }
      );
    },
    [addMessage, conversation, messageText, queryClient, user]
  );

  useEffect(() => {
    if (
      (conversation?.messages.length || isAiTyping) &&
      scrollViewRef.current
    ) {
      scrollViewRef.current.scrollTo({
        top: scrollViewRef.current.scrollHeight,
      });
    }
  }, [conversation?.messages.length, isAiTyping]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <p>{error instanceof Error ? error.message : "Something went wrong!"}</p>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="h-full w-full flex-1 overflow-y-auto" ref={scrollViewRef}>
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          {conversation.messages.map((message, i) => (
            <div key={i} className="my-4">
              <div
                className={clsx(
                  "mb-1 w-fit max-w-[80%] rounded-xl px-3.5 py-3 shadow-sm hover:shadow-lg",
                  message.isAiResponse
                    ? "mr-auto rounded-bl-none bg-white dark:bg-zinc-800"
                    : "ml-auto rounded-br-none bg-indigo-500 text-right text-white"
                )}
              >
                <a className="whitespace-pre-wrap">{message.text}</a>
              </div>
              <p
                className={clsx(
                  "text-sm text-slate-500 dark:text-zinc-400",
                  message.isAiResponse ? "text-left" : "text-right"
                )}
              >
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ))}
          {isAiTyping && <WritingIndicator />}
        </div>
      </div>
      <footer className="h-fit bg-slate-100 dark:bg-zinc-900">
        <div className="mx-auto h-full w-full max-w-4xl px-4 pb-4 md:px-6 md:pb-6">
          <div className=" h-14 overflow-hidden rounded-xl bg-white shadow-xl dark:bg-zinc-800">
            <form onSubmit={handleSubmit} className="h-full">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.currentTarget.value)}
                className="h-full w-full bg-transparent px-6 py-2.5 outline-none"
                placeholder="How can I help you?..."
              />
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Conversation;

Conversation.getLayout = (page) => (
  <ConversationLayout>{page}</ConversationLayout>
);

const WritingIndicator = () => {
  return (
    <div className="mb-4 mr-auto w-fit max-w-[80%] rounded-xl rounded-bl-none bg-white px-3.5 py-3 shadow-sm hover:shadow-lg dark:bg-zinc-800">
      <span className="animate-pulse">•</span>
      <span className="animate-pulse">•</span>
      <span className="animate-pulse">•</span>
    </div>
  );
};
