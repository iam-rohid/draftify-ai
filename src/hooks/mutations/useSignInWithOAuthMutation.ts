import { authClient } from "@/libs/fireabseClient";
import { useMutation } from "@tanstack/react-query";
import {
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const providerFor = (provider: string): AuthProvider => {
  switch (provider) {
    case "google":
      return new GoogleAuthProvider();
    case "github":
      return new GithubAuthProvider();
    default:
      throw `Uhknown provider ${provider}`;
  }
};

export const useSignInWIthOAuthMuation = () => {
  return useMutation({
    mutationKey: ["sign-in-with-oauth"],
    mutationFn: (provider: string) => {
      return signInWithPopup(authClient, providerFor(provider));
    },
  });
};
