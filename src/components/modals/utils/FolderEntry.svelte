<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import Close from "@ktibow/iconset-material-symbols/close-rounded";
  
  export let folderPath: string;
  export let index: number;
  export let onDelete: (index: number) => void;
</script>

<div class="folder-entry">
  <div class="path">{folderPath}</div>
  <Button type="text" iconType="full" size="2rem" on:click={() => onDelete(index)}>
    <Icon icon={Close} />
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

  .folder-entry :global(svg) {
    color: rgb(var(--m3-scheme-error));
  }
</style>