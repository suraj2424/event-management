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
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}) {
  return (
    <ThemeProvider>
      <ClientProvider>
        <Component {...pageProps} />
        <Toaster />
      </ClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
