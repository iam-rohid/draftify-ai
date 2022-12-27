import { supabaseClient } from "@/libs/supabaseClient";
import { InputField } from "@/types/input-field";
import { useQuery } from "@tanstack/react-query";
import { RemirrorJSON } from "remirror";

export const useProjectQuery = (userId: string, projectId: string) => {
  return useQuery({
    queryKey: ["project", userId, projectId],
    queryFn: async () => {
      return supabaseClient
        .from("projects")
        .select(
          `id,
        created_at,
        updated_at,
        name,
        description,
        content,
        template:template_id(
          id,
          inputs,
          name,
          prompt
        )`
        )
        .match({
          id: projectId,
          user_id: userId,
        })
        .limit(1)
        .limit(1, {
          foreignTable: "template_id",
        })
        .single()
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }
          if (!data) throw "Something went wrong!";

          return {
            id: data["id"] as string,
            name: data["name"] as string | undefined,
            createdAt: data["created_at"] as string,
            updatedAt: data["updated_at"] as string | undefined,
            description: data["description"] as string | undefined,
            content: data["content"] as RemirrorJSON | undefined,
            template: data["template"]
              ? {
                  id: (data["template"] as any)["id"] as string,
                  name: (data["template"] as any)["name"] as string,
                  inputs: (data["template"] as any)["inputs"] as InputField[],
                  prompt: (data["template"] as any)["prompt"] as string,
                }
              : undefined,
          };
        });
    },
  });
};
