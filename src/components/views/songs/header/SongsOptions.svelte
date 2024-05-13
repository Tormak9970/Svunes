<script lang="ts">
  import type { MdMenu } from "@material/web/all";
  import { selectedView, songGridSize, songSortOrder } from "../../../../stores/State";
  import { GridSize, type SongSortOrder } from "../../../../types/Settings";
  import { View } from "../../../../types/View";
  import ArrowRight from "../../../icons/ArrowRight.svelte";
  import { fromView } from "../../../../stores/Settings";

  export let menuElement: MdMenu;

  function gridSizeChange(value: number) {
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
        <label for="1-radio">1</label>
        <md-radio id="1-radio" name="gridSize" value="1" checked={$songGridSize === GridSize.LIST} on:input={() => gridSizeChange(1)}></md-radio>
      </div>

      <div class="radio">
        <label for="2-radio">2</label>
        <md-radio id="2-radio" name="gridSize" value="2" checked={$songGridSize === GridSize.TWO} on:input={() => gridSizeChange(2)}></md-radio>
      </div>

      <div class="radio">
        <label for="3-radio">3</label>
        <md-radio id="3-radio" name="gridSize" value="3" checked={$songGridSize === GridSize.THEE} on:input={() => gridSizeChange(3)}></md-radio>
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