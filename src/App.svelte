<script lang="ts">
  import { MediaQuery } from "@component-utils";
  import Content from "./components/Content.svelte";
  import Theme from "./components/theme/Theme.svelte";
  import "./lib/md-defs";
  import { isLandscape } from "./stores/Layout";
</script>

<MediaQuery query="(orientation:landscape)" bind:matches={$isLandscape} />
<Theme>
  <Content />
</Theme>
