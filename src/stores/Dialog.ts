import { writable, type Writable } from "svelte/store";

export const showDialogModal = writable(false);
export const dialogModalTitle = writable("");
export const dialogModalMessage = writable("");
export const dialogModalType: Writable<DialogModalType> = writable("INFO");
export const dialogModalConfirmText = writable("");
export const dialogModalConfirm = writable(async () => {});
export const dialogModalCancelText = writable("");
export const dialogModalCancel = writable(async () => {});