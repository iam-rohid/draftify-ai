import "@/styles/globals.scss";
import "remirror/styles/all.css";
import { queryClient } from "@/libs/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { CustomAppProps } from "@/types/next";
import AuthProvider from "@/providers/AuthProvider";

export default function App({ Component, pageProps }: CustomAppProps) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
