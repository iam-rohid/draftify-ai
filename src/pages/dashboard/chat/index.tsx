import DashboardLayout from "@/layouts/DashboardLayout";
import { openai } from "@/libs/openai";
import { useAuth } from "@/providers/AuthProvider";
import { CustomNextPage } from "@/types/next";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { FormEvent, useCallback, useEffect, useState } from "react";

const BASE_PROMPT = `
The following is a conversation with an AI assistant whose name is Salman Khan. Salman Khan is helpful, creative, clever, and very friendly.

Human: Hello, who are you?
AI: I am an AI created by Rohid. How can I help you today?
`;

type Conversasion = {
  id: "Human" | "AI";
  message: string;
  createdAt: string;
};

const Chat: CustomNextPage = () => {
  const [conversasions, setConversasions] = useState<Conversasion[]>([]);

  const [messageText, setMessageText] = useState("");
  const { user } = useAuth();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!user) return;
      if (!messageText.trim()) return;

      const newConversations: Conversasion[] = [
        ...conversasions,
        {
          id: "Human",
          createdAt: new Date().toISOString(),
          message: messageText,
        },
      ];

      setConversasions(newConversations);
      setMessageText("");

      const prompt =
        BASE_PROMPT +
        newConversations
          .map((conversasion) => `${conversasion.id}: ${conversasion.message}`)
          .join("\n") +
        "AI: ";
      console.log(prompt);

      const { data } = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        top_p: 1,
        temperature: 0.9,
        presence_penalty: 0.6,
        best_of: 1,
        stop: ["Human:", "AI:"],
        user: user.id,
        max_tokens: 190,
      });
      console.log({ data });

      const aiResponse = data.choices[0].text?.trim();

      if (!aiResponse) {
        return;
      }
      setConversasions([
        ...newConversations,
        {
          id: "AI",
          createdAt: new Date().toISOString(),
          message: aiResponse,
        },
      ]);
    },
    [conversasions, messageText, user]
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full flex-col overflow-hidden">
      <div className="flex-1  overflow-y-auto">
        {conversasions.map((conversation, i) => (
          <div
            key={i}
            className={clsx(
              "p-4",
              conversation.id === "AI" ? "text-green-500" : ""
            )}
          >
            <p>{conversation.message}</p>
            <p className="text-sm">
              {formatDistanceToNow(new Date(conversation.createdAt))}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="sticky bottom-0">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.currentTarget.value)}
          className="w-full px-4 py-2.5"
          placeholder="Ask Salman khan something..."
        />
      </form>
    </div>
  );
};

export default Chat;

Chat.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
