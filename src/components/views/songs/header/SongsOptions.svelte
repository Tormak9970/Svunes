<script lang="ts">
  import type { MdMenu } from "@material/web/all";
  import { selectedView, songGridSize, songSortOrder } from "../../../../stores/State";
  import { GridSize, type SongSortOrder } from "../../../../types/Settings";
  import { View } from "../../../../types/View";
  import ArrowRight from "../../../icons/ArrowRight.svelte";
  import { fromView } from "../../../../stores/Settings";

  export let menuElement: MdMenu;

  function gridSizeChange(value: GridSize) {
    $songGridSize = value;
    menuElement.close();
  }
  
  function sortOrderChange(value: SongSortOrder) {
    $songSortOrder = value;
    menuElement.close();
  }

  function goToSettings() {
    $fromView = View.SONGS;
    $selectedView = View.SETTINGS;
    menuElement.close();
  }
</script>

<md-sub-menu style="width: 150px;">
  <md-menu-item slot="item">
    <div slot="headline">Grid Size</div>
    <!-- Arrow icons are helpful affordances -->
    <div slot="end" style="width: 24px;">
      <ArrowRight />
    </div>
  </md-menu-item>
  <!-- Submenu must be slotted into sub-menu's menu slot -->
  <md-menu slot="menu" menu-corner="start-end" anchor-corner="start-start" positioning="popover">
    <div class="sub-menu-header">Grid Size</div>
    <div class="radio-container">
      <div class="radio">
        <label for="1-radio">List</label>
        <md-radio id="1-radio" name="gridSize" value="1" checked={$songGridSize === GridSize.LIST} on:input={() => gridSizeChange(GridSize.LIST)}></md-radio>
      </div>

      <div class="radio">
        <label for="2-radio">Large</label>
        <md-radio id="2-radio" name="gridSize" value="2" checked={$songGridSize === GridSize.LARGE} on:input={() => gridSizeChange(GridSize.LARGE)}></md-radio>
      </div>

      <div class="radio">
        <label for="3-radio">Medium</label>
        <md-radio id="3-radio" name="gridSize" value="3" checked={$songGridSize === GridSize.MEDIUM} on:input={() => gridSizeChange(GridSize.MEDIUM)}></md-radio>
      </div>

      <div class="radio">
        <label for="4-radio">Small</label>
        <md-radio id="4-radio" name="gridSize" value="3" checked={$songGridSize === GridSize.SMALL} on:input={() => gridSizeChange(GridSize.SMALL)}></md-radio>
      </div>
    </div>
  </md-menu>
</md-sub-menu>
<md-sub-menu style="width: 150px;">
  <md-menu-item slot="item">
    <div slot="headline">Sort Order</div>
    <!-- Arrow icons are helpful affordances -->
    <div slot="end" style="width: 24px;">
      <ArrowRight />
    </div>
  </md-menu-item>
  <!-- Submenu must be slotted into sub-menu's menu slot -->
  <md-menu slot="menu" menu-corner="start-end" anchor-corner="start-start" positioning="popover">
    <div class="sub-menu-header">Sort Order</div>
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
    </div>
  </md-menu>
</md-sub-menu>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-menu-item on:click={goToSettings}>
  <div slot="headline">Settings</div>
</md-menu-item>

<style>
  .sub-menu-header {
    font-size: 14px;
    color: var(--md-sys-color-on-surface-variant);

    margin-left: 10px;
    margin-bottom: 5px;
  }

  .radio-container {
    font-size: 16px;
    width: 100%;
  }

  .radio {
    width: calc(100% - 30px);
    height: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    padding: 5px 15px;
  }

  .radio label {
    margin-right: 5px;
  }

  md-radio {
    margin-left: 10px;
  }
</style>