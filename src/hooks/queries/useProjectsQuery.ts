import { supabaseClient } from "@/libs/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useProjectsQuery = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: async () =>
      supabaseClient
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .then(({ data: projects, error }) => {
          console.log({ projects, error, userId });
          if (error) {
            throw error;
          }

          if (!projects) {
            return [];
          }

          return projects.map((project) => ({
            id: project["id"] as string,
            name: project["name"] as string | undefined,
            createdAt: project["created_at"] as string,
            updatedAt: project["updated_at"] as string | undefined,
            description: project["description"] as string | undefined,
          }));
        }),
  });
};
