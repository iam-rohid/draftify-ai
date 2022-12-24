import DashboardLayout from "@/layouts/DashboardLayout";
import { CustomNextPage } from "@/types/next";

const Playground: CustomNextPage = () => {
  return <div>Playground</div>;
};

export default Playground;

Playground.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
