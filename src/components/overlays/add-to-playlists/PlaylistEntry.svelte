<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import Checkbox from "@interactables/Checkbox.svelte";
  import Keep from "@ktibow/iconset-material-symbols/keep-rounded";
  import CardClickable from "@layout/CardClickable.svelte";
  import type { Playlist } from "@lib/models/Playlist";
  import { LIST_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { t } from "@stores/Locale";
  import PlaylistImage from "@views/playlists/PlaylistImage.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let playlist: Playlist;
  export let checked: boolean;
</script>

<CardClickable type="transparent" on:click={() => dispatch("click")} extraOptions={{ style: "width: 100%; display: flex; position: relative; padding: 10px 0px; border-radius: 10px; margin: 0px;" }}>
  <div class="content">
    <div class="left">
      <PlaylistImage playlist={playlist} height={LIST_IMAGE_DIMENSIONS.height} width={LIST_IMAGE_DIMENSIONS.width} />
      <div class="info">
        <div class="name">
          {playlist.name}
        </div>
        <div class="secondary">
          {#if playlist.pinned}
            <div class="pinned-container">
              <Icon icon={Keep} width="16px" height="16px" />
            </div>
          {/if}
          <div>{playlist.songIds.length} {$t(playlist.songIds.length === 1 ? "SONG_SINGULAR_VALUE" : "SONG_PLURAL_VALUE")}</div>
        </div>
      </div>
    </div>
    <div class="options">
      <Checkbox checked={checked} on:input={() => dispatch("click")} />
    </div>
  </div>
</CardClickable>

<style>
  .content {
    width: 100%; 
    display: flex;
    align-items: center;
  }

  .left {
    margin-left: 10px;
    display: flex;
    align-items: center;
    width: calc(100% - 40px);
  }

  .info {
    margin-left: 10px;
    max-width: calc(100% - 75px - 40px);
  }

  .name {
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 16px;
  }

  .secondary > div {
    font-size: 14px;
    color: rgb(var(--m3-scheme-outline));
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary > div.pinned-container {
    color: rgb(var(--m3-scheme-primary));
    transform: rotate(45deg);
  }

  .options {
    width: 40px;
    height: 40px;
    margin-right: 5px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>