<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Song } from "../../../lib/models/Song";
  import IconButton from "../../interactables/IconButton.svelte";
  import MoreVert from "svelte-icons/md/MdMoreVert.svelte";

  export let song: Song;

  $: convertedPath = tauri.convertFileSrc(song.albumPath);

  function onClick() {

  }

  function optionsClick() {

  }

  function select() {

  }
</script>

<div class="song">
  <div class="left">
    <div class="album">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="{convertedPath}" height="40px" width="40px" />
    </div>
    <div class="info">
      <div class="name">
        {song.title}
      </div>
      <div class="artist">
        {song.artist}
      </div>
    </div>
  </div>
  <div class="options">
    <IconButton onClick={optionsClick}>
      <MoreVert />
    </IconButton>
  </div>
</div>

<style>
  .song {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 20px;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .album {
    border-radius: 4px;
    overflow: hidden;
    height: 40px;
    width: 40px;

    margin-left: 20px;
    margin-right: 15px;
  }
</style>