// NOTE: The declaration below was injected by `"framer"`
// see https://www.framer.com/docs/guides/handshake for more information.
declare module "https://framer.com/m/*";

// Temporary: some IDEs/TS setups may not resolve this package's types immediately.
// This ambient declaration prevents false-positive "Cannot find module" errors.
declare module "class-variance-authority" {
  export function cva(...args: any[]): (...args: any[]) => string;
  export type VariantProps<T> = Record<string, any>;
}
