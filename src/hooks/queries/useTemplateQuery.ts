import { supabaseClient } from "@/libs/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useTemplateQuery = (templateId: string) => {
  return useQuery({
    queryKey: ["template", templateId],
    queryFn: async () =>
      supabaseClient
        .from("templates")
        .select("*")
        .eq("id", templateId)
        .limit(1)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        }),
    staleTime: 15 * 60 * 1000,
  });
};
