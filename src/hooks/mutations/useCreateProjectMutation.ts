import { firestoreClient } from "@/libs/fireabseClient";
import { ProjectEntity, projectToDoc } from "@/models/project";
import { useMutation } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

export const useCreateProjectMutation = () => {
  return useMutation({
    mutationKey: ["create-project"],
    mutationFn: async ({
      userId,
      templateId,
      name,
      description,
      body,
    }: {
      userId: string;
      name?: string;
      templateId?: string;
      description?: string;
      body?: string;
    }) => {
      const id = nanoid();
      const project: ProjectEntity = {
        id,
        name,
        templateId: templateId ?? "facebook-ad",
        createdAt: new Date().toISOString(),
        description,
        body,
      };
      const docRef = doc(firestoreClient, "users", userId, "projects", id);
      await setDoc(docRef, projectToDoc(project), { merge: true });
      return project;
    },
  });
};
