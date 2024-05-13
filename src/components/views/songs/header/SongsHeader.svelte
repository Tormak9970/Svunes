<script lang="ts">
  import ViewHeader from "../../../layout/ViewHeader.svelte";
  import IconButton from "../../../interactables/IconButton.svelte";
  import Search from "svelte-icons/md/MdSearch.svelte";
  import MoreVert from "svelte-icons/md/MdMoreVert.svelte";
  import SongsOptions from "./SongsOptions.svelte";
  import MenuButton from "../../../interactables/MenuButton.svelte";

  export let highlight: boolean;

  function openSearch() {

  }
</script>

<ViewHeader title="Songs" highlight={highlight}>
  <div slot="left">
    <IconButton onClick={openSearch}>
      <Search />
    </IconButton>
  </div>
  <div slot="right">
    <MenuButton hasOverflow>
      <span slot="icon">
        <MoreVert />
      </span>
      <SongsOptions />
    </MenuButton>
  </div>
</ViewHeader>