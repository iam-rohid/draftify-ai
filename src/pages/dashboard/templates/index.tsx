import DashboardLayout from "@/layouts/DashboardLayout";
import { CustomNextPage } from "@/types/next";

const Templates: CustomNextPage = () => {
  return <div>Templates</div>;
};

export default Templates;

Templates.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
