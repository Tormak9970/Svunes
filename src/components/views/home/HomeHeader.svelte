<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import Search from "@ktibow/iconset-material-symbols/search";
  import Settings from "@ktibow/iconset-material-symbols/settings";
  import { selectedChip } from "@stores/Search";
  import { lastView, selectedView } from "@stores/State";
  import { push } from "svelte-spa-router";
  import { View } from "../../../types/View";
  import Icon from "../../utils/Icon.svelte";
  import ViewHeader from "../utils/ViewHeader.svelte";

  export let highlight: boolean;

  /**
   * Navigates to the settings view.
   */
  function goToSettings() {
    $lastView = $selectedView;
    $selectedView = View.SETTINGS;
    push("/settings");
  }

  /**
   * Navigates to the search view.
   */
  function openSearch() {
    $lastView = $selectedView;
    $selectedView = View.SEARCH;
    $selectedChip = "album";
    push("/search");
  }

  let menuIsOpen = false;
</script>

<ViewHeader title="Tunistic" highlight={highlight}>
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