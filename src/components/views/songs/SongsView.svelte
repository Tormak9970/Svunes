<script lang="ts">
  import { songs } from "../../../stores/State";
  import ViewContainer from "../ViewContainer.svelte";
  import ListEntry from "./list/ListEntry.svelte";
  import SongsHeader from "./header/SongsHeader.svelte";
  import VirtualList from "../../layout/VirtualList.svelte";
  
  let isAtTop = true;
</script>

<ViewContainer>
  <div slot="header">
    <SongsHeader highlight={!isAtTop} />
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    <VirtualList itemHeight={60} items={$songs} keyFunction={(entry) => `${entry.data.title}${entry.data.album}${entry.data.artist}`} bind:isAtTop={isAtTop} let:entry>
      <ListEntry song={entry} />
    </VirtualList>
  </div>
</ViewContainer>