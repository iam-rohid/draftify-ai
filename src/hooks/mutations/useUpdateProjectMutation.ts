import { supabaseClient } from "@/libs/supabaseClient";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProjectMutation = () => {
  return useMutation({
    mutationFn: async (variables: {
      projectId: string;
      userId: string;
      data: {
        name?: string | null;
        description?: string | null;
        content?: any;
        isFavorite?: boolean | null;
        isDeleted?: boolean | null;
      };
    }) => {
      const { userId, projectId, data } = variables;
      return supabaseClient
        .from("projects")
        .update({
          name: data.name,
          content: data.content,
          description: data.description,
        })
        .match({
          id: projectId,
          user_id: userId,
        });
    },
  });
};
