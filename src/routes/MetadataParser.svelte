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
  import type { TabItem } from "@layout/TabsHeader.svelte";
  import { EditController } from "@lib/controllers/EditController";
  import { showParserVariables } from "@stores/Modals";
  import { showWritingChanges } from "@stores/Overlays";
  import ParsePreview from "@views/metadata-parser/ParsePreview.svelte";
  import type { ParseResult } from "../types/MetadataParser";

  type MatchGroups = {
    title?: string;
    album?: string;
    artist?: string;
    albumArtist?: string;
    track?: string,
    genre?: string;
    year?: string;
  }
  
  const groups = {
    "%title%": "(?<title>.+?)",
    "%album%": "(?<album>.+?)",
    "%track%": "(?<track>\\d+?)",
    "%artist%": "(?<artist>.+?)",
    "%albumartist%": "(?<albumArtist>.+?)",
    "%genre%": "(?<genre>.+?)",
    "%year%": "(?<year>\\d+?)",
    "%dummy%": "(.+)",
  }
  const groupFieldLUT = {
    "%title%": "title",
    "%album%": "album",
    "%track%": "track",
    "%artist%": "artist",
    "%albumartist%": "albumArtist",
    "%genre%": "genre",
    "%year%": "year",
  }
  const groupNameLUT = {
    "%title%": "Title",
    "%album%": "Album",
    "%track%": "Track",
    "%artist%": "Artist",
    "%albumartist%": "Album Artist",
    "%genre%": "Genre",
    "%year%": "Year",
  }
  const templateSplitter = /(%title%|%album%|%track%|%artist%|%albumartist%|%genre%|%year%|%dummy%)+/;

  let isAtTop = true;
  let canSave = false;
  let parserWasRun = false;
  
  let patternString = "%track% %album% - %title%.%dummy%";
  let results: ParseResult[] = [];
  let tabsUsed: TabItem[] = [];
  let tab: string = "";

  function escapeRegExpElements(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function checkForDuplicates(pattern: string) {
    for (const variable of Object.keys(groups)) {
      if (variable === "%dummy%") continue;
      const regExp = new RegExp(variable, "gi");
      if ((pattern.match(regExp) ?? []).length >= 2) return true;
    }

    return false;
  }


  function cancel() {
    pop();
    $songIdsToParse = [];
  }
  
  /**
   * Writes the changes to the song files and updates the in-memory data.
   */
  function save() {
    const songPaths: Record<string, string> = {};
    const changes: Record<string, SongEditFields> = {};
    const filteredResults = results.filter((result) => Object.keys(result).length > 2);

    for (let i = 0; i < filteredResults.length; i++) {
      const result = filteredResults[i];
      const song = $songsMap[result.songId];
      
      songPaths[song.id] = song.filePath;
      changes[song.filePath] = {
        "artPath": song.artPath,
        "title": result.title ?? song.title,
        "album": result.album ?? song.album,
        "composer": song.composer,
        "albumArtist": result.albumArtist ?? song.albumArtist,
        "artist": result.artist ?? song.artist,
        "releaseYear":  result.year ?? song.releaseYear,
        "genre": result.genre ?? song.genre,
        "trackNumber": result.track ?? song.trackNumber
      }
    }

    $showWritingChanges = true;
    EditController.bulkEditSongs(songPaths, changes).then(() => {
      canSave = false;
      $showWritingChanges = false;
      pop();
      $songIdsToParse = [];
    });
  }

  /**
   * Parses the songs with the user's provided pattern.
   */
  function parse() {
    if (patternString.includes("%%")) {
      $showErrorSnackbar({ message: "Must have a space/character between variables" });
      return;
    }

    if (checkForDuplicates(patternString)) {
      $showErrorSnackbar({ message: "Found duplicate variables (besides %dummy%)" });
      return;
    }

    parserWasRun = true;
    const tabs: TabItem[] = [];

    let patternParts = patternString.split(templateSplitter);
    patternParts = patternParts.slice(1, patternParts.length - 1);

    for (let i = 0; i < patternParts.length; i++) {
      const element = patternParts[i] as (keyof typeof groupNameLUT | "%dummy%");

      const group = groups[element];
      if (group) {
        patternParts[i] = group;

        if (element !== "%dummy%") {
          tabs.push({ label: groupNameLUT[element], value: groupFieldLUT[element] });
        }
      } else {
        patternParts[i] = escapeRegExpElements(element);
      }
    }

    const renderedFields = tabs.map((tab) => tab.value);
    if (!renderedFields.includes(tab)) tab = tabs[0].value;

    tabsUsed = tabs;

    const withGroups = patternParts.join("");
    const regex = new RegExp(`^${withGroups}$`);

    results = $songIdsToParse.map((id) => {
      const song = $songsMap[id];
      const fileName = song.fileName;
      const match = fileName.match(regex);

      if (match && match.groups) {
        const group = match.groups as MatchGroups;

        return {
          songId: song.id,
          fileName: song.fileName,
          title: group.title?.trim(),
          album: group.album?.trim(),
          artist: group.artist?.trim(),
          track: group.track ? parseInt(group.track?.trim()) : undefined,
          albumArtist: group.albumArtist?.trim(),
          genre: group.genre?.trim(),
          year: group.year ? parseInt(group.year?.trim()) : undefined,
        }
      }

      return {
        songId: song.id,
        fileName: song.fileName,
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
        <Button type="text" iconType="full" disabled={results.length === 0} on:click={save}>
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
        <ParsePreview results={results} tabsUsed={tabsUsed} bind:tab={tab} />
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
    height: calc(100% - (2.5rem + 10px) - 10px);
    overflow: hidden;
  }
</style>