import { supabaseClient } from "@/libs/supabaseClient";
import { useMutation } from "@tanstack/react-query";
import { RemirrorJSON } from "remirror";

export const useUpdateProjectMutation = () => {
  return useMutation({
    mutationFn: async (variables: {
      projectId: string;
      userId: string;
      data: {
        name?: string;
        description?: string;
        content?: RemirrorJSON;
        isFavorite?: boolean;
        isPinned?: boolean;
        isDeleted?: boolean;
      };
    }) => {
      const { userId, projectId, data } = variables;
      return supabaseClient
        .from("projects")
        .update({
          name: data.name,
          content: data.content,
          description: data.description,
          is_deleted: data.isDeleted,
          is_favorite: data.isFavorite,
          is_pinned: data.isPinned,
        })
        .match({
          id: projectId,
          user_id: userId,
        });
    },
  });
};
