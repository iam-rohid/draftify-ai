import { firestoreClient } from "@/libs/fireabseClient";
import { projectFromDoc } from "@/models/project";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

export const useProjectQuery = (userId: string, projectId: string) => {
  return useQuery({
    queryKey: ["project", userId, projectId],
    queryFn: async () => {
      const docRef = doc(
        firestoreClient,
        "users",
        userId,
        "projects",
        projectId
      );
      const snapshot = await getDoc(docRef);
      return projectFromDoc(snapshot);
    },
  });
};
