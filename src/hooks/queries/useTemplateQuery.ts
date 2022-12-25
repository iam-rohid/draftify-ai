import { firestoreClient } from "@/libs/fireabseClient";
import { templateFromDoc } from "@/models/template";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

export const useTemplateQuery = (templateId: string) => {
  return useQuery({
    queryKey: ["template", templateId],
    queryFn: async () => {
      const docRef = doc(firestoreClient, "templates", templateId);
      const snapshot = await getDoc(docRef);
      return templateFromDoc(snapshot);
    },
    staleTime: 15 * 60 * 1000,
  });
};
