<script lang="ts">
  import { Close, Edit } from "@icons";
  import { Button } from "@interactables";
  import Icon from "../Icon.svelte";
  
  export let label: string;
  export let index: number;
  export let onEdit: (index: number) => void;
  export let onDelete: (index: number) => void;
</script>

<div class="editable-entry">
  <div class="font-label entry-label">{label}</div>
  <div class="buttons">
    <Button type="text" iconType="full" size="2rem" on:click={() => onEdit(index)}>
      <Icon icon={Edit} />
    </Button>
    <Button type="text" iconType="full" size="2rem" on:click={() => onDelete(index)}>
      <Icon icon={Close} />
    </Button>
  </div>
</div>

<style>
  .editable-entry {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 10px;
  }

  .entry-label {
    max-width: 240px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .buttons :global(:nth-child(2) svg) {
    color: rgb(var(--m3-scheme-error));
  }
</style>