<script lang="ts">
  import Content from "./components/Content.svelte";
  import Theme from "./components/theme/Theme.svelte";
  import "./lib/md-defs";
  
  /**
   * Prevents undesired keypresses.
   * @param event The keyboard event.
   */
  function preventKeyPresses(event: KeyboardEvent) {
    // * Prevent reload events
    // ! shift part aint workin
    // TODO: shift + F5
    if (event.key === "F5" || (event.ctrlKey && event.key === 'r') || (event.metaKey && event.key === 'r') || (event.ctrlKey && event.shiftKey && event.key === 'r') || (event.metaKey && event.shiftKey && event.key === 'r')) event.preventDefault();
    
    // * Prevent print events
    // ! shift part aint workin
    if ((event.ctrlKey && event.key === 'p') || (event.metaKey && event.key === 'p') || (event.ctrlKey && event.shiftKey && event.key === 'p') || (event.metaKey && event.shiftKey && event.key === 'p')) event.preventDefault();
    
    // * Prevent save events
    if ((event.ctrlKey && event.key === 's') || (event.metaKey && event.key === 's')) event.preventDefault();
    
    // * Prevent search events
    if ((event.ctrlKey && event.key === 'f') || (event.metaKey && event.key === 'f') || (event.ctrlKey && event.shiftKey && event.key === 'f') || (event.metaKey && event.shiftKey && event.key === 'f')) event.preventDefault();
    if ((event.ctrlKey && event.key === 'g') || (event.metaKey && event.key === 'g') || (event.ctrlKey && event.shiftKey && event.key === 'g') || (event.metaKey && event.shiftKey && event.key === 'g')) event.preventDefault();
    
    // * Prevent view source events
    if ((event.ctrlKey && event.key === 'u') || (event.metaKey && event.key === 'u')) event.preventDefault();
    
    // * Prevent read alloud events
    if ((event.ctrlKey && event.shiftKey && event.key === 'u') || (event.metaKey && event.shiftKey && event.key === 'u')) event.preventDefault();
    
    // * Prevent view downloads events
    if ((event.ctrlKey && event.key === 'j') || (event.metaKey && event.key === 'j')) event.preventDefault();
    
    // * Prevent screenshot events
    // ! shift part aint workin
    if ((event.ctrlKey && event.shiftKey && event.key === 's') || (event.metaKey && event.shiftKey && event.key === 's')) event.preventDefault();
    
    // * Prevent alt left events
    
    // * Prevent alt right events

    // * Prevent alt F4
  }
</script>

<svelte:document on:keydown={preventKeyPresses} on:contextmenu|preventDefault />

<Theme>
  <Content />
</Theme>
