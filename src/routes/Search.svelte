<script lang="ts">
  import ViewContainer from "@component-utils/ViewContainer.svelte";
  import SearchHeader from "@views/search/SearchHeader.svelte";
  import SearchResults from "@views/search/SearchResults.svelte";

  let highlight = false;
</script>

<ViewContainer>
  <div slot="header">
    <SearchHeader highlight={highlight} />
  </div>
  <div slot="content" style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center;">
    <SearchResults bind:isScrolled={highlight} />
  </div>
</ViewContainer>