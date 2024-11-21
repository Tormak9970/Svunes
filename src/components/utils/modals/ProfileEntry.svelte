<script lang="ts">
  import { Close, Edit } from "@icons";
  import { Button, TextField } from "@interactables";
  import { createEventDispatcher } from "svelte";
  import Icon from "../Icon.svelte";
  
  export let label: string;
  export let index: number;
  export let editable = true;
  export let deletable = true;
  export let onEdit: (index: number, value: string) => void;
  export let onDelete: (index: number) => void;

  let editing = false;
  
  const dispatch = createEventDispatcher();

  function startEdit() {
    dispatch("editStart");
    editing = true;
  }
  
  function endEdit() {
    dispatch("editEnd");
    editing = false;
  }

  function handleEdit(e: Event) {
    editing = false;
    const target = e.currentTarget as HTMLInputElement;
    onEdit(index, target.value);
  }
</script>

<div class="editable-entry">
  <TextField
    name={""}
    value={label}
    on:change={handleEdit}
    extraWrapperOptions={{
      style: "height: 2.5rem"
    }}
    disabled={!editing}
  />
  <div class="buttons">
    {#if editing}
      <Button type="text" iconType="full" size="2rem" on:click={endEdit}>
        <Icon icon={Close} />
      </Button>
    {:else}
      <Button type="text" iconType="full" size="2rem" on:click={startEdit} disabled={!editable}>
        <Icon icon={Edit} />
      </Button>
    {/if}
    <Button type="text" iconType="full" size="2rem" on:click={() => onDelete(index)} disabled={!deletable || editing}>
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
  }

  .editable-entry :global(.m3-container input:disabled) {
    color: rgb(var(--m3-scheme-on-surface) / 0.6);
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .buttons :global(:nth-child(2) svg) {
    color: rgb(var(--m3-scheme-error));
  }
  
  .buttons :global(button:disabled:nth-child(2) svg) {
    color: rgb(var(--m3-scheme-error) / 0.4);
  }
</style>