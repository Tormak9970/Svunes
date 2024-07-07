<script lang="ts">
  import type { ParseResult } from "../../../types/MetadataParser";

  export let result: ParseResult;
  export let tab: string;
  
  import Icon from "@component-utils/Icon.svelte";
  import ArrowForward from "@ktibow/iconset-material-symbols/arrow-forward-rounded";
  import SubdirectoryArrowRight from "@ktibow/iconset-material-symbols/subdirectory-arrow-right-rounded";

  $: doesntMatchPattern = Object.keys(result).length === 2;
  // @ts-expect-error Tab will always index result because of checks in MetadataParser.svelte.
  $: value = doesntMatchPattern ? "Doesn't match pattern" : (result[tab] === "" ? "None" : result[tab]);
</script>

<div class="parse-entry">
  <div class="filename">
    {result.fileName}
  </div>
  <div class="parsed-value">
    <Icon icon={SubdirectoryArrowRight} />
    <div class="field">{tab}</div>
    <Icon icon={ArrowForward} />
    <div class="value" style:color="rgb(var({doesntMatchPattern ? "--m3-scheme-error" : "--m3-scheme-primary"})">{value}</div>
  </div>
</div>

<style>
  .parse-entry {
    display: flex;
    flex-direction: column;
  }

  .filename {
    text-wrap: nowrap;
    
    color: rgb(var(--m3-scheme-on-surface) / 0.8);
  }

  .parsed-value {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    color: rgb(var(--m3-scheme-on-surface) / 0.38);
  }

  .value {
    color: rgb(var(--m3-scheme-primary));
  }
</style>