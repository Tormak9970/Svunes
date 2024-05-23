<script lang="ts">
  import Button from "../../interactables/Button.svelte";
  import Icon from "../../utils/Icon.svelte";
  import Close from "@ktibow/iconset-material-symbols/close-rounded";
  
  export let folderPath: string;
  export let index: number;
  export let onDelete: (index: number) => void;
</script>

<div class="folder-entry">
  <div class="path">{folderPath}</div>
  <Button type="filled" iconType="full" extraOptions={{ style: "width: 24px; height: 24px" }} on:click={() => onDelete(index)}>
    <div style="height: 100%; display: flex; justify-content: center; align-items: center;">
      <Icon icon={Close} width="20px" height="20px" />
    </div>
  </Button>
</div>

<style>
  .folder-entry {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 10px;
  }

  .path {
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>