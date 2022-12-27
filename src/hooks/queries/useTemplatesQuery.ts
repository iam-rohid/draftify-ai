import { supabaseClient } from "@/libs/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useTemplatesQuery = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () =>
      supabaseClient
        .from("templates")
        .select("id,description,name")
        .eq("is_public", true)
        .then(({ data: templates, error }) => {
          if (error) throw error;
          if (!templates) throw "Something went wrong";
          return templates.map((template) => ({
            id: template["id"],
            name: template["name"],
            description: template["description"],
          }));
        }),
    staleTime: 32 * 60 * 1000,
  });
};
