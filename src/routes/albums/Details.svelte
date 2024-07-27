<script lang="ts">
  import DetailsInner from './DetailsInner.svelte';
  
  export let params: { key?: string } = {};
</script>

{#key params.key}
  <DetailsInner {params} />
{/key}

