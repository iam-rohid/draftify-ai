import OAuthProvidersList from "@/components/OAuthProvidersList";
import AuthLayout from "@/layouts/AuthLayout";
import HomeLayout from "@/layouts/HomeLayout";
import { CustomNextPage } from "@/types/next";
import Link from "next/link";

const Join: CustomNextPage = () => {
  return (
    <div className="mx-auto max-w-md py-16">
      <div className="rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="m-6 text-center">
          <h1 className="mb-2 text-2xl font-bold">Get Started</h1>
          <p className="text-slate-600 dark:text-zinc-300">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident,
            dolores.
          </p>
        </div>

        <form className="m-4 sm:m-6">
          <div className="flex gap-4">
            <label className="flex-1 text-slate-600 dark:text-zinc-300">
              First Name
              <input
                type="text"
                className="mt-1 w-full rounded-lg bg-slate-100 py-2.5 px-4 outline-none ring-2 ring-slate-200 focus:ring-indigo-500 dark:bg-zinc-800 dark:ring-zinc-700"
                placeholder="John"
              />
            </label>
            <label className="flex-1 text-slate-600 dark:text-zinc-300">
              Last Name
              <input
                type="text"
                className="mt-1 w-full rounded-lg bg-slate-100 py-2.5 px-4 outline-none ring-2 ring-slate-200 focus:ring-indigo-500 dark:bg-zinc-800 dark:ring-zinc-700"
                placeholder="Doe"
              />
            </label>
          </div>

          <label className="mt-4 block text-slate-600 dark:text-zinc-300">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-lg bg-slate-100 py-2.5 px-4 outline-none ring-2 ring-slate-200 focus:ring-indigo-500 dark:bg-zinc-800 dark:ring-zinc-700"
              placeholder="john@email.com"
            />
          </label>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-slate-900 py-3 px-4 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Continue with Email
          </button>

          <p className="mt-2 text-slate-600 dark:text-zinc-300">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-slate-900 dark:text-white"
            >
              Sign in
            </Link>
          </p>
        </form>

        <p className="my-6 text-center uppercase text-slate-500">Or</p>

        <OAuthProvidersList />
      </div>
    </div>
  );
};

export default Join;

Join.getLayout = (page) => (
  <HomeLayout>
    <AuthLayout>{page}</AuthLayout>
  </HomeLayout>
);
