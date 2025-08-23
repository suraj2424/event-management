import "../app/globals.css";
import ClientProvider from "../providers/clientprovider";
import React from "react";
import { ThemeProvider } from "@/providers/contexts/theme-context";
import { ThemeScript } from "@/components/theme-script";
import { Toaster } from "react-hot-toast";

function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: Record<string, unknown>;
}) {
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);
  return (
    <ThemeProvider>
      <ClientProvider>
        {getLayout(<Component {...pageProps} />)}
        <Toaster />
      </ClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
