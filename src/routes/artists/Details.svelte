<script lang="ts">
  import { DetailsArtPicture, DetailsBody, Icon, OverlayHeader } from "@component-utils";
  import { EditController, LogController, PlaybackController, QueueController } from "@controllers";
  import { isScrolled } from "@directives";
  import { BackArrow, MoreVert, Sort } from "@icons";
  import { Button, MenuButton, PlayButton, RadioMenuButton, RadioMenuItem, ToggleShuffleButton } from "@interactables";
  import { AlbumCarouselList, ArtistCarousel, Marquee, SongsList } from "@layout";
  import { Artist, type Song } from "@models";
  import { t } from "@stores/Locale";
  import { onArtOptionsDone, showArtOptions } from "@stores/Modals";
  import { artistToAdd, showAddToPlaylist } from "@stores/Overlays";
  import { albumsMap, artists, artistsMap, isPaused, nowPlayingList, shuffle, songsMap, useArtistColors } from "@stores/State";
  import type { ArtistEntriesSortOrder } from "@types";
  import { getRandomElements, stringSort } from "@utils";
  import { pop, push } from "svelte-spa-router";

  let artistSortMethod: ArtistEntriesSortOrder = "Album";

  export let params: { key?: string } = {};
  $: key = params.key;
  $: artist = params.key ? $artistsMap[params!.key!] : undefined;
  $: artistAlbums = Array.from(artist?.albumNames ?? []).map((name) => $albumsMap[name]);

  $: if (!artist && key) {
    pop();
  }

  $: songs = artist?.songIds?.map((id) => $songsMap[id]);
  $: sortedSongs = songs ? sortSongs(songs, artistSortMethod) : [];

  $: allSimilarArtists = artist?.similarArtists;
  // @ts-ignore
  $: similarArtists = (allSimilarArtists && allSimilarArtists?.length > 5) ? getRandomElements<Artist>(allSimilarArtists, 5) : similarArtists;

  let highlight = false;
  let rerenderArt = false;

  /**
   * Closes the details overlay.
   */
  function back() {
    pop();
  }

  /**
   * Plays this artist.
   */
  function playArtist() {
    if ($nowPlayingList === artist!.name) {
      if (!$isPaused) {
        PlaybackController.pause();
      } else {
        PlaybackController.resume();
      }
    } else {
      PlaybackController.playArtist(artist!);
    }
  }

  /**
   * Plays this artist next.
   */
  function playNext() {
    QueueController.playArtistsNext([artist!.name]);
  }

  /**
   * Queues this artist.
   */
  function queueArtist() {
    QueueController.queueArtists([artist!.name]);
  }

  /**
   * Opens the add to playlist dialog with this artist set to be added.
   */
  function addToPlaylist() {
    $artistToAdd = artist!.name;
    $showAddToPlaylist = true;
  }

  /**
   * Shows all similar artists.
   */
  function showAllSimilar() {
    push(`/artists/${artist!.name}/similar`);
  }

  /**
   * Sorts the artist's songs.
   * @param songsList The list of songs.
   * @param sortOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortSongs(songsList: Song[], sortOrder: ArtistEntriesSortOrder): Song[] {
    let sorted: Song[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = songsList.sort(stringSort<Song>("title"));
    } else if (sortOrder === "Album") {
      sorted = songsList.sort(stringSort<Song>("album"));
    } else if (sortOrder === "Year") {
      sorted = songsList.sort((a: Song, b: Song) => b.releaseYear - a.releaseYear);
    } else if (sortOrder === "Song Duration") {
      sorted = songsList.sort((a: Song, b: Song) => a.length - b.length);
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  /**
   * Handles prompting the user to change the artist's art.
   */
  function onArtistArtClick() {
    $onArtOptionsDone = async (path: string | undefined) => {
      artist!.imagePath = await EditController.copyArtistImage(path);
      await artist?.setBackgroundFromImage();
      $artists = [ ...$artists ];
      rerenderArt = !rerenderArt;
    }
    $showArtOptions = true;
  }
  
  const menuItems = [
    { id: "play-next", text: $t("PLAY_NEXT_ACTION"), action: playNext },
    { id: "queue", text: $t("ADD_TO_QUEUE_ACTION"), action: queueArtist },
    { id: "add-to-playlist", text: $t("ADD_TO_PLAYLIST_ACTION"), action: addToPlaylist }
  ]
</script>

{#key key}
  <DetailsBody>
    <span slot="header">
      <OverlayHeader highlight={highlight}>
        <span slot="left">
          <Button type="text" iconType="full" on:click={back}>
            <Icon icon={BackArrow} width="20px" height="20px" />
          </Button>
        </span>
        <span slot="right" style="display: flex; flex-direction: row;">
          <MenuButton icon={MoreVert} items={menuItems} />
        </span>
      </OverlayHeader>
    </span>
    <span class="content styled-scrollbar" slot="content" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
      <div class="content-inner">
        {#key rerenderArt}
          <DetailsArtPicture artPath={artist?.imagePath} clickable on:click={onArtistArtClick} />
        {/key}
        <div class="details">
          <div class="info">
            <Marquee speed={50} gap={100}>
              <h3 class="name">{artist?.name}</h3>
            </Marquee>
            <div class="font-body other">{`${artist?.albumNames.size} ${artist?.albumNames.size === 1 ? $t("ALBUM_SINGULAR_VALUE") : $t("ALBUM_PLURAL_VALUE")} • `}{`${artist?.songIds.length} ${artist?.songIds.length === 1 ? $t("SONG_SINGULAR_VALUE") : $t("SONG_PLURAL_VALUE")} • `}{artist?.displayArtistSongLength()}</div>
          </div>
          {#key rerenderArt}
            <div class="buttons" style="{(artist?.backgroundColor && $useArtistColors) ? `--m3-scheme-primary: ${artist.backgroundColor};` : ""}">
              <ToggleShuffleButton bind:shuffle={$shuffle} />
              <PlayButton name={artist?.name} on:click={playArtist} />
            </div>
          {/key}
        </div>
        {#if artistAlbums.length > 0 }
          <div class="albums">
            <div class="section-header">
              <h3 class="label">{$t("ALBUMS_TITLE")}</h3>
              <div />
            </div>
            <AlbumCarouselList albums={artistAlbums} />
          </div>
        {/if}
        <div class="songs">
          <div class="section-header">
            <h3 class="label">{$t("SONGS_TITLE")}</h3>
            <RadioMenuButton icon={Sort}>
              <RadioMenuItem name="artistEntriesSort" label={$t("ALPHABETICAL_LABEL")} checked={artistSortMethod === "Alphabetical"} on:input={() => artistSortMethod = "Alphabetical" } />
              <RadioMenuItem name="artistEntriesSort" label={$t("ALBUM_LABEL")} checked={artistSortMethod === "Album"} on:input={() => artistSortMethod = "Album"} />
              <RadioMenuItem name="artistEntriesSort" label={$t("YEAR_LABEL")} checked={artistSortMethod === "Year"} on:input={() => artistSortMethod = "Year"} />
              <RadioMenuItem name="artistEntriesSort" label={$t("SONG_DURATION_LABEL")} checked={artistSortMethod === "Song Duration"} on:input={() => artistSortMethod = "Song Duration"} />
            </RadioMenuButton>
          </div>
          <SongsList songs={sortedSongs} />
        </div>
        {#if similarArtists && similarArtists?.length > 0}
          <ArtistCarousel label={$t("SIMILAR_ARTISTS_TITLE")} artists={similarArtists} on:click={showAllSimilar} />
        {/if}
        <div style="width: 100%; height: 70px;" />
      </div>
    </span>
  </DetailsBody>
{/key}

<style>
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
  }

  .content-inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .info {
    margin-top: 10px;
    width: calc(100% - 110px);
  }

  .name {
    margin: 0px;

    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
  }

  .other {
    color: rgb(var(--m3-scheme-outline));
  }

  .section-header {
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .section-header .label {
    font-weight: bold;
    margin: 0px;
  }

  .details {
    width: calc(100% - 30px);
    margin: 0px 15px;
    margin-bottom: 5px;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .buttons {
    display: flex;
    align-items: center;

    gap: 10px;
  }

  .albums,
  .songs {
    width: 100%;
  }

  .albums .section-header,
  .songs .section-header {
    width: calc(100% - 20px);
    margin-left: 15px;
  }

  .albums .section-header {
    margin-bottom: 10px; /* this accounts for other containers having padding on the following element */
  }
</style>