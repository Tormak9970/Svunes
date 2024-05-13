<script lang="ts">
  import ViewHeader from "../../../layout/ViewHeader.svelte";
  import IconButton from "../../../interactables/IconButton.svelte";
  import Search from "svelte-icons/md/MdSearch.svelte";
  import MoreVert from "svelte-icons/md/MdMoreVert.svelte";
  import SongsOptions from "./SongsOptions.svelte";
  import MenuButton from "../../../interactables/MenuButton.svelte";
  import { selectedView } from "../../../../stores/State";
  import { View } from "../../../../types/View";
  import { selectedChip } from "../../../../stores/Search";

  export let highlight: boolean;

  function openSearch() {
    $selectedChip = "song";
    $selectedView = View.SEARCH;
  }
</script>

<ViewHeader title="Songs" highlight={highlight}>
  <div slot="left">
    <IconButton onClick={openSearch}>
      <Search />
    </IconButton>
  </div>
  <div slot="right">
    <MenuButton hasOverflow let:menuElement>
      <span slot="icon">
        <MoreVert />
      </span>
      <SongsOptions menuElement={menuElement} />
    </MenuButton>
  </div>
</ViewHeader>