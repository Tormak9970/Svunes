<script lang="ts">
  import { MediaQuery } from "@component-utils";
  import { isLandscape } from "@stores/Layout";
  import Content from "../../components/Content.svelte";
  import Theme from "../../components/theme/Theme.svelte";
  import "../../lib/md-defs";
</script>

<MediaQuery query="(orientation:landscape)" bind:matches={$isLandscape} />
<Theme>
  <Content />
</Theme>
