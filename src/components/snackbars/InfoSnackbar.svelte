<script lang="ts">
  import GenericSnackbar from "./GenericSnackbar.svelte";
  
  let showInfo: (data: ShowSnackbarOptions) => void;
  
  export const show = (data: { message: any; }) => {
    showInfo({ message: data.message, timeout: 2500 });
  }

  const backgroundColor = "var(--m3-scheme-inverse-surface)";
  const textColor = "var(--m3-scheme-inverse-on-surface)";
</script>

<GenericSnackbar backgroundColor={backgroundColor} textColor={textColor} bind:show={showInfo} />