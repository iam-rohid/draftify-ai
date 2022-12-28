import { supabaseClient } from "@/libs/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateNewConversationMutation = () => {
  const { user } = useAuth();

  return useMutation({
    mutationKey: ["create-new-conversation"],
    mutationFn: async ({
      name,
      description,
      settings,
    }: {
      name?: string;
      description?: string;
      settings?: {
        model?: string;
        top_p?: number;
        temperature?: number;
        presence_penalty?: number;
        best_of?: number;
        stop?: string[] | string;
        max_tokens?: number;
      };
    }) => {
      if (!user) throw "Unathenticated";

      return supabaseClient
        .from("conversations")
        .insert({
          user_id: user.id,
          name,
          description,
          settings,
        })
        .select("id")
        .limit(1)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        });
    },
  });
};

export const useGetConversationsList = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["get-coversations", userId],
    queryFn: async () => {
      return supabaseClient
        .from("conversations")
        .select("id,name,description,created_at,updated_at")
        .then(({ data, error }) => {
          if (error) throw error;
          if (!data) return [];
          return data.map((conversation) => ({
            id: conversation["id"] as string,
            name: conversation["name"] as string | undefined,
            description: conversation["description"] as string | undefined,
            createdAt: conversation["created_at"] as string | undefined,
            updatedAt: conversation["updated_at"] as string | undefined,
          }));
        });
    },
  });
};

export const useGetConversationWithMessagesQuery = (props: {
  conversationId: string;
  userId: string;
}) => {
  return useQuery({
    queryKey: ["coversation-with-messages", props.conversationId, props.userId],
    queryFn: async () => {
      return supabaseClient
        .from("conversations")
        .select(
          `
        id,
        created_at,
        updated_at,
        name,
        description,
        settings,
        messages: messages(
          id,
          text,
          created_at,
          updated_at,
          is_ai_response
        )
      `
        )
        .match({
          user_id: props.userId,
          id: props.conversationId,
        })
        .limit(1)
        .order("created_at", {
          ascending: true,
          foreignTable: "messages",
        })
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return {
            id: data["id"] as string,
            name: data["name"] as string | undefined,
            description: data["description"] as string | undefined,
            createdAt: data["created_at"] as string | undefined,
            updatedAt: data["updated_at"] as string | undefined,
            settings: data["settings"] as any,
            messages: (data["messages"] as any[]).map((message) => ({
              id: message["id"] as string,
              text: message["text"] as string,
              createdAt: message["created_at"] as string,
              updatedAt: message["updated_at"] as string,
              isAiResponse: message["is_ai_response"] as boolean,
            })),
          };
        });
    },
  });
};

export const useAddMessageMutation = () => {
  return useMutation({
    mutationKey: ["add-message"],
    mutationFn: async ({
      text,
      isAiResponse,
      createdAt,
      userId,
      conversationId,
    }: {
      userId: string;
      conversationId: string;
      text: string;
      isAiResponse: boolean;
      createdAt: string;
    }) => {
      return supabaseClient
        .from("messages")
        .insert({
          user_id: userId,
          conversation_id: conversationId,
          text,
          is_ai_response: isAiResponse,
          created_at: createdAt,
        })
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        });
    },
  });
};
