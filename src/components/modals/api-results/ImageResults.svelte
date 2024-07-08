<script lang="ts">
  import { imageResults, onImageResultsDone, showImageResults } from "@stores/Modals";
  import ModalBody from "../utils/ModalBody.svelte";

  $: console.log($imageResults);

  function cancel() {
    $showImageResults = false;
    $imageResults = [];
    $onImageResultsDone(null);
    $onImageResultsDone = () => {};
  }
</script>

<ModalBody open headline="Search Results" on:close={cancel}>
  
</ModalBody>

<style>
  
</style>