import { firestoreClient } from "@/libs/fireabseClient";
import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";

export const useUpdateProjectMutation = () => {
  return useMutation({
    mutationFn: async (variables: {
      projectId: string;
      userId: string;
      data: {
        name?: string | null;
        content?: any;
        isFavorite?: boolean | null;
        isDeleted?: boolean | null;
      };
    }) => {
      const { userId, projectId, data } = variables;
      const docRef = doc(
        firestoreClient,
        "users",
        userId,
        "projects",
        projectId
      );

      return updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    },
  });
};
