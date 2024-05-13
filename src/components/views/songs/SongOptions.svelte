<script lang="ts">
  import type { Song } from "../../../lib/models/Song";

  export let song: Song;
</script>

<md-menu-item style="width: 180px;">
  <div slot="headline">Play</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Play Next</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Add to queue</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Add to playlist</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Go to album</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Go to artist</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Details</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Edit</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Share</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Hide</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Delete from device</div>
</md-menu-item>