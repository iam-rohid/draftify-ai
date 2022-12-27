import { useMutation } from "@tanstack/react-query";
import { Provider } from "@supabase/supabase-js";
import { supabaseClient } from "@/libs/supabaseClient";

const providerFor = (provider: string): Provider => {
  switch (provider) {
    case "google":
      return "google";
    case "github":
      return "github";
    default:
      throw `Uhknown provider ${provider}`;
  }
};

export const useSignInWIthOAuthMuation = () => {
  return useMutation({
    mutationKey: ["sign-in-with-oauth"],
    mutationFn: (provider: Provider) => {
      return supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
    },
  });
};
