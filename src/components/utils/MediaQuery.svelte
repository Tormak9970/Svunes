<script lang="ts">
  import { onMount } from "svelte";

  export let query: string;
  /**
   * DO NOT MODIFY OUTSIDE OF COMPONENT.
   * Initial value must be false
   */
  export let matches = false;

  let mql: MediaQueryList;
  let queryListener: (event: any) => void;
  let wasMounted = false;

  onMount(() => { wasMounted = true; return () => { removeActiveListener(); }; });

  $: {
    if (wasMounted) { removeActiveListener(); addNewListener(query); }
  }

  function addNewListener(query:string) {
    mql = window.matchMedia(query);
    queryListener = (event: MediaQueryList) => matches = event.matches;
    mql.addEventListener("change", queryListener);
    matches = mql.matches;
  }

  function removeActiveListener() {
    if (mql && queryListener) mql.removeEventListener('change', queryListener);
  }
</script>