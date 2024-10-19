<script lang="ts">
  import { Close, Edit } from "@icons";
  import { Button } from "@interactables";
  import Icon from "../Icon.svelte";
  
  export let folderPath: string;
  export let index: number;
  export let onEdit: (index: number) => void;
  export let onDelete: (index: number) => void;
</script>

<div class="folder-entry">
  <div class="font-label path">{folderPath}</div>
  <Button type="text" iconType="full" size="2rem" on:click={() => onEdit(index)}>
    <Icon icon={Edit} />
  </Button>
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
    max-width: 240px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .folder-entry :global(:nth-child(3) svg) {
    color: rgb(var(--m3-scheme-error));
  }
</style>