import { authClient } from "@/libs/fireabseClient";
import { useMutation } from "@tanstack/react-query";

export const useSignOutMutation = () => {
  return useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      await authClient.signOut();
    },
  });
};
