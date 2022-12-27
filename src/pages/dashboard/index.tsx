import { useRouter } from "next/router";
import { useEffect } from "react";

const DashboardRoot = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/projects");
  }, [router]);
  return null;
};

export default DashboardRoot;
