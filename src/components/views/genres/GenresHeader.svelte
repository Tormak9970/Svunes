<script lang="ts">
  import ViewHeader from "../utils/ViewHeader.svelte";
  import { selectedChip } from "../../../stores/Search";
  import Search from "@ktibow/iconset-material-symbols/search";
  import Settings from "@ktibow/iconset-material-symbols/settings";
  import Button from "../../interactables/Button.svelte";
  import Icon from "../../utils/Icon.svelte";
  import { push } from "svelte-spa-router";
  import { selectedView } from "../../../stores/State";
  import { View } from "../../../types/View";

  export let highlight: boolean;

  /**
   * Navigates to the settings view.
   */
  function goToSettings() {
    $selectedView = View.SETTINGS;
    push("/settings");
  }

  /**
   * Navigates to the search view.
   */
  function openSearch() {
    $selectedView = View.SEARCH;
    $selectedChip = "all";
    push("/search");
  }
</script>

<ViewHeader title="Genres" highlight={highlight}>
  <div slot="left">
    <Button type="text" iconType="full" on:click={openSearch}>
      <Icon icon={Search} width="20px" height="20px" />
    </Button>
  </div>
  <div slot="right">
    <Button type="text" iconType="full" on:click={goToSettings}>
      <Icon icon={Settings} width="20px" height="20px" />
    </Button>
  </div>
</ViewHeader>