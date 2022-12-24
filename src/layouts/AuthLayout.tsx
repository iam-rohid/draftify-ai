import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!!user) {
    router.replace("/dashboard");
    return <div>You are alread authorized</div>;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-100 to-transparent dark:from-zinc-800/50">
      {children}
    </div>
  );
};

export default AuthLayout;
