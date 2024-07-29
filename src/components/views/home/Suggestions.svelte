<script lang="ts">
  import { Icon } from "@component-utils";
  import { Button } from "@interactables";

  import Refresh from "@ktibow/iconset-material-symbols/refresh-rounded";
  import { t } from "@stores/Locale";
  import { albums } from "@stores/State";
  import { shuffle } from "@utils";
  import FavoritesMix from "./FavoritesMix.svelte";
  import SuggestionEntry from "./SuggestionEntry.svelte";

  const smallSize = 68;

  let shuffled = shuffle($albums);
  $: limited = shuffled.slice(0, 8);

  function regenerate() {
    shuffled = shuffle($albums);
  }
</script>

<div class="suggestions-container">
  <div class="suggestions-header">
    <h3 class="label">{$t("SUGGESTIONS_TITLE")}</h3>
    <Button type="text" iconType="full" on:click={regenerate}>
      <Icon icon={Refresh} width="20px" height="20px" />
    </Button>
  </div>
  <div class="suggestions">
    <div class="row">
      <FavoritesMix />
      <div class="column">
        <SuggestionEntry album={limited[0]} size={smallSize} />
        <SuggestionEntry album={limited[1]} size={smallSize} />
      </div>
      <SuggestionEntry album={limited[2]} />
    </div>
    <div class="row" style="margin-top: 10px;">
      <SuggestionEntry album={limited[3]} size={smallSize} />
      <SuggestionEntry album={limited[4]} size={smallSize} />
      <SuggestionEntry album={limited[5]} size={smallSize} />
      <SuggestionEntry album={limited[6]} size={smallSize} />
      <SuggestionEntry album={limited[7]} size={smallSize} />
    </div>
  </div>
</div>

<style>
  .suggestions-container {
    width: 100%;
  }

  .suggestions-header {
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 20px);
    margin-left: 15px;
  }

  .suggestions-header .label {
    font-weight: bold;
    margin: 0px;
  }

  .suggestions {
    width: calc(100% - 20px);
    margin: 0px 10px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
</style>