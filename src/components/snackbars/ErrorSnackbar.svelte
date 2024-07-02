<script lang="ts">
  import GenericSnackbar from "./GenericSnackbar.svelte";
  
  let showError: (data: ShowSnackbarOptions) => void;
  
  export const show = (data: { message: any; faster: any; }) => {
    showError({ message: data.message, timeout: data.faster ? 2000 : 3000 });
  }

  const backgroundColor = "var(--m3-scheme-error)";
  const textColor = "var(--m3-scheme-on-error)";
</script>

<GenericSnackbar backgroundColor={backgroundColor} textColor={textColor} bind:show={showError} />