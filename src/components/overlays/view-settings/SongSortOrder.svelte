<!-- <div class="radio-container">
<div class="radio-container">
  <div class="radio">
    <label for="alphabetical">Alphabetical</label>
    <md-radio id="alphabetical" name="sortOrder" value="1" checked={$songSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")}></md-radio>
  </div>

  <div class="radio">
    <label for="album">Album</label>
    <md-radio id="album" name="sortOrder" value="3" checked={$songSortOrder === "Album"} on:input={() => sortOrderChange("Album")}></md-radio>
  </div>

  <div class="radio">
    <label for="artist">Artist</label>
    <md-radio id="artist" name="sortOrder" value="3" checked={$songSortOrder === "Artist"} on:input={() => sortOrderChange("Artist")}></md-radio>
  </div>

  <div class="radio">
    <label for="year">Year</label>
    <md-radio id="year" name="sortOrder" value="3" checked={$songSortOrder === "Year"} on:input={() => sortOrderChange("Year")}></md-radio>
  </div>

  <div class="radio">
    <label for="last-played">Last Played</label>
    <md-radio id="last-played" name="sortOrder" value="3" checked={$songSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")}></md-radio>
  </div>
</div> -->

<script lang="ts">
  import Body from "./Body.svelte";
  import { songSortOrder } from "../../../stores/State";
  import { showSongSortOrder } from "../../../stores/Overlays";
  import type { SongSortOrder } from "../../../types/Settings";
  import RadioInput from "../../interactables/RadioInput.svelte";

  function sortOrderChange(order: SongSortOrder) {
    $songSortOrder = order;
    $showSongSortOrder = false;
  }
</script>

<Body headline="Sort Order" open={$showSongSortOrder}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Alphabetical"} onChange={() => sortOrderChange("Alphabetical")} />
      <div class="radio">Alphabetical</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Album"} onChange={() => sortOrderChange("Album")} />
      <div class="radio">Album</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Artist"} onChange={() => sortOrderChange("Artist")} />
      <div class="radio">Artist</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Year"} onChange={() => sortOrderChange("Year")} />
      <div class="radio">Year</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Last Played"} onChange={() => sortOrderChange("Last Played")} />
      <div class="radio">Last Played</div>
    </label>
  </div>
</Body>

<style>
  .content {
    display: flex;
    flex-direction: column;
  }

  label {
    display: flex;
    align-items: center;
  }

  .radio {
    margin-left: 15px;
    font-size: 16px;
  }
</style>