import Link from "next/link";

const PageNotFound = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center text-center">
      <h1 className="mb-8 text-7xl font-bold">404</h1>
      <p className="mb-4 text-2xl font-semibold">Page Not Found</p>
      <Link
        href="/"
        className="text-xl font-medium text-indigo-500 underline-offset-2 hover:underline"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
