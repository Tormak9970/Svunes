<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import GenericSnackbar from "./GenericSnackbar.svelte";

  export let extraWrapperOptions: HTMLAttributes<HTMLDivElement> = {};
  export let extraOptions: HTMLAttributes<HTMLDivElement> = {};
  
  export let show: (data: ShowSnackbarOptions) => void;

  const backgroundColor = "var(--m3-scheme-error)";
  const textColor = "var(--m3-scheme-on-error)";
</script>

<GenericSnackbar extraWrapperOptions={extraWrapperOptions} extraOptions={extraOptions} backgroundColor={backgroundColor} textColor={textColor} bind:show={show} />