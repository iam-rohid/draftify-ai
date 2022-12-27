import { supabaseClient } from "@/libs/supabaseClient";
import { useMutation } from "@tanstack/react-query";

export const useCreateProjectMutation = () => {
  return useMutation({
    mutationKey: ["create-project"],
    mutationFn: async ({
      userId,
      templateId,
      name,
      description,
    }: {
      userId: string;
      templateId: string;
      name?: string;
      description?: string;
    }) => {
      return supabaseClient
        .from("projects")
        .insert({
          user_id: userId,
          template_id: templateId,
          name: name,
          description: description,
        })
        .select("id")
        .limit(1)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data["id"] as string;
        });
    },
  });
};
