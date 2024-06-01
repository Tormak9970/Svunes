<script lang="ts">
  import GenericSnackbar from "./GenericSnackbar.svelte";
  
  export let show: (data: ShowSnackbarOptions) => void;

  const backgroundColor = "var(--m3-scheme-inverse-surface)";
  const textColor = "var(--m3-scheme-inverse-on-surface)";
</script>

<GenericSnackbar backgroundColor={backgroundColor} textColor={textColor} bind:show={show} />