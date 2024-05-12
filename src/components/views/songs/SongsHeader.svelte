<script lang="ts">
  import ViewHeader from "../../layout/ViewHeader.svelte";
  import IconButton from "../../interactables/IconButton.svelte";
  import Search from "svelte-icons/md/MdSearch.svelte";
  import MoreVert from "svelte-icons/md/MdMoreVert.svelte";

  export let highlight: boolean;

  function openSearch() {

  }

  function songOptions() {

  }
</script>

<ViewHeader title="Songs" highlight={highlight}>
  <div slot="left">
    <IconButton onClick={openSearch}>
      <Search />
    </IconButton>
  </div>
  <div slot="right">
    <IconButton onClick={songOptions}>
      <MoreVert />
    </IconButton>
  </div>
</ViewHeader>