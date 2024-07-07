<script lang="ts">
  import DetailsBody from "@component-utils/DetailsBody.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { showErrorSnackbar, songIdsToParse, songsMap } from "@stores/State";
  import { pop } from "svelte-spa-router";
  
  import TextField from "@interactables/TextField.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import CheckCircle from "@ktibow/iconset-material-symbols/check-circle-rounded";
  import Help from "@ktibow/iconset-material-symbols/help-rounded";
  import TextRotationNone from "@ktibow/iconset-material-symbols/text-rotation-none-rounded";
  import { showParserVariables } from "@stores/Modals";

  type MatchGroups = {
    title?: string;
    album?: string;
    artist?: string;
    albumArtist?: string;
    track?: string,
    genre?: string;
    year?: string;
  }

  type Result = MatchGroups & {
    songId: string,
  }
  
  const groups = {
    "%title%": "(?<title>.+)",
    "%album%": "(?<album>.+)",
    "%track%": "(?<track>\\d+)",
    "%artist%": "(?<artist>.+)",
    "%albumartist%": "(?<albumArtist>.+)",
    "%genre%": "(?<genre>.+)",
    "%year%": "(?<year>\\d+)",
    "%dummy%": "(?.+)",
  }
  const templateSplitter = /(%title%|%album%|%track%|%artist%|%albumartist%|%genre%|%year%|%dummy%)+/;

  let isAtTop = true;
  let canSave = false;
  let parserWasRun = false;
  
  let patternString = "%track% %title% - %album%.%dummy%";
  let results: Result[] = [];


  function escapeRegExpElements(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function checkForDuplicates(pattern: string) {
    for (const variable of Object.keys(groups)) {
      const regExp = new RegExp(variable, "gi");
      if ((pattern.match(regExp) ?? []).length >= 2) return true;
    }

    return false;
  }


  function cancel() {
    pop();
    $songIdsToParse = [];
  }
  
  function save() {
    // TODO: save changes
    const changes: Record<string, SongEditFields> = {};
    const filteredResults = results.filter((result) => Object.keys(result).length > 1);

    for (let i = 0; i < filteredResults.length; i++) {
      const result = filteredResults[i];
      const song = $songsMap[result.songId];
        
      changes[song.id] = {
        "artPath": song.artPath,
        "title": result.title ?? song.title,
        "album": result.album ?? song.album,
        "composer": song.composer,
        "albumArtist": result.albumArtist ?? song.albumArtist,
        "artist": result.artist ?? song.artist,
        "releaseYear":  result.year ? parseInt(result.year) : song.releaseYear,
        "genre": result.genre ?? song.genre,
        "trackNumber": result.track ? parseInt(result.track) : song.trackNumber
      }
    }

    console.log("changes:", changes);

    // pop();
    // $songIdsToParse = [];
  }

  function parse() {
    if (patternString.includes("%%")) {
      $showErrorSnackbar({ message: "Must have a space/character between variables" });
      return;
    }

    if (checkForDuplicates(patternString)) {
      $showErrorSnackbar({ message: "Found duplicate variables (besides %dummy%)" });
      return;
    }

    let withoutTemplates = patternString.split(templateSplitter);
    withoutTemplates = withoutTemplates.slice(1, withoutTemplates.length - 1);

    for (let i = 0; i < withoutTemplates.length; i++) {
      const element = withoutTemplates[i];

      // @ts-expect-error It is expected that element won't always index group.
      const group = groups[element];
      if (group) {
        withoutTemplates[i] = group;
      } else {
        withoutTemplates[i] = escapeRegExpElements(element);
      }
    }

    const withGroups = withoutTemplates.join("");
    const regex = new RegExp(`^${withGroups}$`);

    results = $songIdsToParse.map((id) => {
      const song = $songsMap[id];
      const fileName = song.fileName;
      const match = fileName.match(regex);

      if (match && match.groups) {
        const group = match.groups as MatchGroups;

        return {
          songId: song.id,
          title: group.title?.trim(),
          album: group.album?.trim(),
          artist: group.artist?.trim(),
          track: group.track?.trim(),
          albumArtist: group.albumArtist?.trim(),
          genre: group.genre?.trim(),
          year: group.year?.trim(),
        }
      }

      return {
        songId: song.id,
      };
    });
  }
</script>

<DetailsBody bind:isAtTop={isAtTop}>
  <span slot="header">
    <OverlayHeader highlight={!isAtTop}>
      <span slot="left" style="display: flex; align-items: center; gap: 10px;">
        <Button type="text" iconType="full" on:click={cancel}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div style="font-size: 20px;">Metadata Parser</div>
      </span>
      <span slot="right" style="display: flex; flex-direction: row; gap: 5px">
        <Button type="text" iconType="full" on:click={parse}>
          <Icon icon={TextRotationNone} width="20px" height="20px" />
        </Button>
        <Button type="text" iconType="full" on:click={() => $showParserVariables = true }>
          <Icon icon={Help} width="20px" height="20px" />
        </Button>
        <Button type="text" iconType="full" disabled={!canSave} on:click={save}>
          <Icon icon={CheckCircle} width="20px" height="20px" />
        </Button>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    <div class="pattern-container">
      <TextField name="Pattern" bind:value={patternString} extraWrapperOptions={{ style: "height: 2.5rem; width: 100%" }} />
    </div>
    <div class="preview">
      {#if results.length === 0 && parserWasRun}
        <div class="message-container">
          <div class="message">No results for this parser with the selected tracks.</div>
        </div>
      {:else if results.length === 0}
        <div class="message-container">
          <div class="message">Run a parser to see results.</div>
        </div>
      {:else}

      {/if}
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
    padding-bottom: 70px;
  }
  
  .message-container {
    margin-top: 20%;
    color: rgb(var(--m3-scheme-on-secondary));
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .message {
    font-size: 20px;
  }

  .pattern-container {
    margin-top: 10px;

    width: calc(100% - 3rem);

    display: flex;
    align-items: center;

    gap: 0.5rem;
  }

  .pattern-container :global(.m3-container label) {
    top: 0.5rem;
  }

  .preview {
    width: calc(100% - 3rem);
    margin-top: 10px;
  }
</style>