<script lang="ts">
  import { onSongInfoResultsDone, showSongInfoResults, songResults } from "@stores/Modals";
  import ModalBody from "../utils/ModalBody.svelte";

  $: console.log($songResults);

  function cancel() {
    $showSongInfoResults = false;
    $songResults = [];
    $onSongInfoResultsDone(null);
    $onSongInfoResultsDone = () => {};
  }
</script>

<ModalBody open headline="Search Results" on:close={cancel}>
  
</ModalBody>

<style>
  
</style>