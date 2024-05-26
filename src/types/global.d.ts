/// <reference types="svelte" />
/// <reference types="vite/client" />

declare const APP_VERSION: string;
declare const IS_DEBUG: string;

type DialogModalType = "INFO" | "WARNING" | "ERROR";

type ShowSnackbarOptions = {
  message: string;
  closable?: boolean;
  timeout?: number | null;
}

declare module "svelte-icons/md/*.svelte";