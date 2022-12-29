import {
  useAddMessageMutation,
  useGetConversationWithMessagesQuery,
} from "@/hooks/conversations";
import ConversationLayout from "@/layouts/ConversationLayout";
import { openai } from "@/libs/openai";
import { useAuth } from "@/providers/AuthProvider";
import { CustomNextPage } from "@/types/next";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/router";
import {
  useState,
  useCallback,
  FormEvent,
  useRef,
  useEffect,
  Fragment,
} from "react";
import { HiOutlineUser } from "react-icons/hi2";

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
  const textBoxRef = useRef<HTMLTextAreaElement>(null);
  const [textBoxHeight, setTextBoxHeight] = useState(24);
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

  useEffect(() => {
    const handleInput = (event: Event) => {
      const height = (event.currentTarget as HTMLTextAreaElement).scrollHeight;
      console.log({ height });
      setTextBoxHeight(height);
    };
    const element = textBoxRef.current;
    element?.addEventListener("input", handleInput);
    console.log({ element });

    return () => {
      element?.removeEventListener("input", handleInput);
    };
  }, [textBoxRef]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center">
        <div className="box-jumping-loader"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <p>{error instanceof Error ? error.message : "Something went wrong!"}</p>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div
        className="flex flex-1 flex-col overflow-y-auto pb-6 md:pb-8"
        ref={scrollViewRef}
      >
        <ul>
          {conversation.messages.map((message, i) => (
            <Fragment key={message.id}>
              <li>
                <div className="flex flex-row gap-4 px-4 py-2 hover:bg-slate-200 dark:hover:bg-zinc-800 md:px-6">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300/70 dark:bg-zinc-700/70">
                      {message.isAiResponse ? (
                        <p className="uppercase">AI</p>
                      ) : (
                        <HiOutlineUser className="text-xl" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm">
                      <b>{message.isAiResponse ? "AI" : "You"}</b>
                      <span className="ml-2 text-slate-500 dark:text-zinc-400">
                        {format(
                          new Date(message.createdAt),
                          "MM/dd/yyyy h:mm b"
                        )}
                      </span>
                    </p>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              </li>
              {i < conversation.messages.length - 1 && (
                <div className="px-4 py-4 md:px-6">
                  <hr className="border-slate-200 opacity-50 dark:border-zinc-700"></hr>
                </div>
              )}
            </Fragment>
          ))}

          {isAiTyping && (
            <div>
              <div className="px-4 py-4 md:px-6">
                <hr className="border-slate-200 opacity-50 dark:border-zinc-700"></hr>
              </div>

              <li>
                <div className="flex flex-row gap-4 px-4 py-2 hover:bg-slate-200 dark:hover:bg-zinc-800 md:px-6">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300/70 dark:bg-zinc-700/70">
                      <p className="text-lg font-bold uppercase">AI</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm">
                      <b>AI</b>
                      <span className="ml-2 text-slate-500 dark:text-zinc-400">
                        Typing...
                      </span>
                    </p>
                    <p className="animate-pulse whitespace-pre-wrap">•••</p>
                  </div>
                </div>
              </li>
            </div>
          )}
        </ul>
      </div>
      <form
        onSubmit={handleSubmit}
        className="-mt-2 h-fit px-4 pb-4 md:px-6 md:pb-6"
      >
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.currentTarget.value)}
          className="max-h-32 w-full resize-none rounded-lg bg-white px-6 py-3 outline-none dark:bg-zinc-800"
          placeholder="How can I help you?..."
          autoFocus
          style={{
            height: textBoxHeight + 24,
          }}
        />
      </form>
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
