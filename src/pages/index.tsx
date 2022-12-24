import HomeLayout from "@/layouts/HomeLayout";
import { CustomNextPage } from "@/types/next";

const HomePage: CustomNextPage = () => {
  return <div>Home</div>;
};

export default HomePage;

HomePage.getLayout = (page) => <HomeLayout>{page}</HomeLayout>;
