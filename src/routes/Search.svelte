<script lang="ts">
  import { ViewContainer } from "@component-utils";
  import SearchHeader from "@views/search/SearchHeader.svelte";
  import SearchResults from "@views/search/SearchResults.svelte";

  let highlight = false;
</script>

<ViewContainer>
  <div slot="header">
    <SearchHeader highlight={highlight} />
  </div>
  <div slot="content" style="height: calc(100% - 50px); width: 100%; display: flex; flex-direction: column; align-items: center;">
    <SearchResults bind:isScrolled={highlight} />
  </div>
</ViewContainer>