import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactNode } from "react";

export type CustomNextPage = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export type CustomAppProps = AppProps & {
  Component: CustomNextPage;
};
