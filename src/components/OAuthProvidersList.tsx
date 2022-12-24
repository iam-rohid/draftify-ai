import { useSignInWIthOAuthMuation } from "@/hooks/mutations/useSignInWithOAuthMutation";
import { FaGoogle, FaGithub } from "react-icons/fa";

const OAuthProvidersList = () => {
  const {
    mutate: signInWithOAuth,
    isLoading,
    isError,
    error,
  } = useSignInWIthOAuthMuation();

  return (
    <div className="m-4 space-y-4 sm:m-6">
      {isError && (
        <p>
          {error instanceof Error ? error.message : "Something went wrong!"}
        </p>
      )}

      <button
        disabled={isLoading}
        onClick={() => signInWithOAuth("google")}
        className="flex h-11 w-full items-center justify-center gap-4 rounded-lg border border-slate-200 px-4 hover:border-slate-300 hover:text-slate-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
      >
        <FaGoogle className="text-xl" />
        Continue with Google
      </button>
      <button
        disabled={isLoading}
        onClick={() => signInWithOAuth("github")}
        className="flex h-11 w-full items-center justify-center gap-4 rounded-lg border border-slate-200 px-4 hover:border-slate-300 hover:text-slate-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
      >
        <FaGithub className="text-xl" />
        Continue with Github
      </button>
    </div>
  );
};

export default OAuthProvidersList;
