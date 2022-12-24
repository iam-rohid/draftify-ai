import DashboardLayout from "@/layouts/DashboardLayout";
import { CustomNextPage } from "@/types/next";

const Dashboard: CustomNextPage = () => {
  return <div>Dashboard</div>;
};

export default Dashboard;

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
