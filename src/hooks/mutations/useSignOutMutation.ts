import { supabaseClient } from "@/libs/supabaseClient";
import { useMutation } from "@tanstack/react-query";

export const useSignOutMutation = () => {
  return useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      await supabaseClient.auth.signOut();
    },
  });
};
