import { firestoreClient } from "@/libs/fireabseClient";
import { templateFromDoc } from "@/models/template";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

export const useTemplatesQuery = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const colRef = collection(firestoreClient, "templates");
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((doc) => templateFromDoc(doc));
    },
    staleTime: 32 * 60 * 1000,
  });
};
