<script lang="ts">
  import DetailsInner from './DetailsInner.svelte';
  
  export let params: { key?: string } = {};
  $: key = params.key;
</script>

{#key key}
  <DetailsInner {params} />
{/key}

