<script lang="ts">
  import Close from "../../icons/Close.svelte";
    import FilledIconButton from "../../interactables/FilledIconButton.svelte";
  
  export let folderPath: string;
  export let index: number;
  export let onDelete: (index: number) => void;
</script>

<div class="folder-entry">
  <div class="path">{folderPath}</div>
  <div class="button-container">
    <FilledIconButton height="22px" width="22px" iconSize="16px" fillColor="--md-sys-color-error-container" onClick={() => onDelete(index)}>
      <Close />
    </FilledIconButton>
  </div>
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