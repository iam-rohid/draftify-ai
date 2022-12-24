import DashboardLayout from "@/layouts/DashboardLayout";
import { CustomNextPage } from "@/types/next";

const Trash: CustomNextPage = () => {
  return <div>Trash</div>;
};

export default Trash;

Trash.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
