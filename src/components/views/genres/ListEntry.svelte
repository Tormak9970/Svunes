<script lang="ts">
  import CardClickable from "@layout/CardClickable.svelte";
  import type { Genre } from "@lib/models/Genre";
  import { LIST_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { t } from "@stores/Locale";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import ViewImage from "../../utils/ViewImage.svelte";

  export let genre: Genre;

  $: convertedPath = genre.imagePreviewPath ? convertFileSrc(genre.imagePreviewPath) : "";
  

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    push(`/genres/${genre.name}`);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" on:click={onClick} extraOptions={{ style: "width: 100%; display: flex; position: relative; padding: 10px 0px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content">
    <div class="left">
      <ViewImage src={convertedPath} width={LIST_IMAGE_DIMENSIONS.width} height={LIST_IMAGE_DIMENSIONS.height} borderRadius="4px" marginLeft="10px" />
      <div class="info">
        <div class="name">
          {genre.name}
        </div>
        <div class="secondary">
          <div in:fade={{ duration: 200 }}>{genre.songIds.length} {genre.songIds.length === 1 ? $t("TRACKS_SINGULAR_VALUE") : $t("TRACKS_PLURAL_VALUE")}</div>
        </div>
      </div>
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
    display: flex;
    align-items: center;
    width: 100%;
  }

  .info {
    max-width: calc(100% - 75px - 30px);
    margin-left: 15px;
  }

  .name {
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary {
    font-size: 14px;
    color: rgb(var(--m3-scheme-outline));
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>