// pages/_app.tsx
import "../app/globals.css"
import ClientProvider from "../providers/clientprovider";
import React from "react";
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: { Component: React.ComponentType, pageProps: Record<string, unknown> }) {
  return (
    <ClientProvider>
      <Component {...pageProps} />
      <Toaster/>
    </ClientProvider>
  );
}

export default MyApp;
