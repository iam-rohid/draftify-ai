import { firestoreClient } from "@/libs/fireabseClient";
import { projectFromDoc } from "@/models/project";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

export const useProjectsQuery = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      const colRef = collection(firestoreClient, "users", userId, "projects");
      return getDocs(colRef).then((snapshot) =>
        snapshot.docs.map((doc) => projectFromDoc(doc))
      );
    },
  });
};
