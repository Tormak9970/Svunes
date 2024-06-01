<script lang="ts">
  import GenericSnackbar from "./GenericSnackbar.svelte";
  
  export let show: (data: ShowSnackbarOptions) => void;

  const backgroundColor = "var(--m3-scheme-error)";
  const textColor = "var(--m3-scheme-on-error)";
</script>

<GenericSnackbar backgroundColor={backgroundColor} textColor={textColor} bind:show={show} />