import { supabaseClient } from "@/libs/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useProjectsQuery = ({
  userId,
  filter,
}: {
  userId: string;
  filter?: {
    isDeleted?: boolean;
    isFavorite?: boolean;
    isPinned?: boolean;
  };
}) => {
  let match: any = {};
  match.user_id = userId;
  if (filter?.isDeleted !== undefined) {
    match.is_deleted = filter.isDeleted;
  }
  if (filter?.isFavorite !== undefined) {
    match.is_favorite = filter.isFavorite;
  }
  if (filter?.isPinned !== undefined) {
    match.is_pinned = filter.isPinned;
  }

  return useQuery({
    queryKey: ["projects", userId, filter],
    queryFn: async () =>
      supabaseClient
        .from("projects")
        .select("*")
        .match(match)
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
