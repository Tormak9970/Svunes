<script lang="ts">
  import SearchHeader from "@views/search/SearchHeader.svelte";
  import SearchResults from "@views/search/SearchResults.svelte";
  import ViewContainer from "@views/utils/ViewContainer.svelte";

  let isAtTop = true;
  
  function scrollHandler(e: Event) {
    const element = e.currentTarget as HTMLDivElement;
    isAtTop = element.scrollTop === 0;
  }
</script>

<ViewContainer>
  <div slot="header">
    <SearchHeader highlight={!isAtTop} />
  </div>
  <div slot="content" style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center;" on:scroll={scrollHandler}>
    <SearchResults />
  </div>
</ViewContainer>