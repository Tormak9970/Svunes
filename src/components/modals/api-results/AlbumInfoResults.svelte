<script lang="ts">
  import { albumResults, availableReleaseGroups, onAlbumInfoResultsDone, selectedReleaseGroupId, showAlbumInfoResults } from "@stores/Modals";
  import ModalBody from "../utils/ModalBody.svelte";

  $: console.log($albumResults);

  function cancel() {
    $showAlbumInfoResults = false;
    $albumResults = [];
    $availableReleaseGroups = [];
    $selectedReleaseGroupId = "";
    $onAlbumInfoResultsDone(null);
    $onAlbumInfoResultsDone = () => {};
  }
</script>

<ModalBody open headline="Search Results" on:close={cancel}>
  
</ModalBody>

<style>
  
</style>