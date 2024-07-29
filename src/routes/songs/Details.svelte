<script lang="ts">
  import { DetailsArtPicture, DetailsBody, Icon, OverlayHeader } from "@component-utils";
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import { songsMap } from "@stores/State";
  import DetailsField from "./DetailsField.svelte";
  
  import { isScrolled } from "@directives";
  import Album from "@ktibow/iconset-material-symbols/album";
  import Artist from "@ktibow/iconset-material-symbols/artist";
  import Location from "@ktibow/iconset-material-symbols/folder-open-rounded";
  import Frequency from "@ktibow/iconset-material-symbols/graphic-eq-rounded";
  import FileSize from "@ktibow/iconset-material-symbols/hard-drive-2";
  import Genre from "@ktibow/iconset-material-symbols/library-music-rounded";
  import Duration from "@ktibow/iconset-material-symbols/schedule-rounded";
  import Sell from "@ktibow/iconset-material-symbols/sell";
  import TrackNumber from "@ktibow/iconset-material-symbols/tag-rounded";
  import ReleaseYear from "@ktibow/iconset-material-symbols/today-rounded";
  import { t } from "@stores/Locale";
  import { goToSongEdit } from "@utils";
  import SongOptions from "@views/songs/SongOptions.svelte";
  import { pop } from "svelte-spa-router";
  
  export let params: { id?: string } = {};
  $: song = params.id ? $songsMap[params.id] : null;

  let highlight = false;
  let menuIsOpen = false;

  /**
   * Closes the details overlay.
   */
  function back() {
    pop();
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    goToSongEdit(song!.id);
  }
</script>

<DetailsBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
      <span slot="left">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
      </span>
      <span slot="right" style="display: flex; flex-direction: row;">
        <Button type="text" iconType="full" on:click={showSongEdit}>
          <Icon icon={Edit} width="20px" height="20px" />
        </Button>
        <div style="height: 100%; width: 5px;" />
        <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
          {#if song}
            <SongOptions bind:menuIsOpen={menuIsOpen} song={song} hideEditOption />
          {/if}
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content styled-scrollbar" slot="content" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
    <div class="content-inner">
      <DetailsArtPicture artPath={song?.artPath} />
      <div class="details">
        <DetailsField icon={Sell} headline={song?.title ?? $t("UNKOWN_VALUE")} />
        <DetailsField icon={Album} headline={song?.album ?? $t("UNKOWN_VALUE")} />
        <DetailsField icon={Artist} headline={song?.artist ?? $t("UNKOWN_VALUE")} />
        <DetailsField icon={ReleaseYear} headline={song?.releaseYear === -1 ? $t("UNKOWN_VALUE") : song?.releaseYear.toString()} />
        <DetailsField icon={Genre} headline={song?.genre ?? $t("UNKOWN_VALUE")} />
        <DetailsField icon={TrackNumber} headline={song?.displayTrack()} />
        <DetailsField icon={Duration} headline={song?.displayLength()} />
        <DetailsField icon={Frequency} headline={song?.displayFrequency()} />
        <DetailsField icon={Location} supporting={song?.filePath} />
        <DetailsField icon={FileSize} headline={song?.displaySize()} />
      </div>
      <div style="width: 100%; height: 70px;" />
    </div>
  </span>
</DetailsBody>

<style>
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
    overflow-x: hidden;
  }

  .content-inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .details {
    width: 100%;
  }
</style>