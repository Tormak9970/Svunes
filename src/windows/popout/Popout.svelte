<script lang="ts">
  import { PopoutReciever } from "@controllers";
  import { Button } from "@interactables";
  import { onDestroy, onMount } from "svelte";
  import Theme from "../../components/theme/Theme.svelte";
  import "../../lib/md-defs";

  function closePopout() {
    PopoutReciever.closeWindow();
  }

  onMount(() => {
    PopoutReciever.init();
  });

  onDestroy(() => {
    PopoutReciever.destroy();
  });
</script>

<!-- TODO: header -->
<div class="header" data-tauri-drag-region>
  <Button type="tonal" on:click={closePopout}>Close</Button>
</div>
<Theme>
  <!-- TODO: content -->
</Theme>