<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
  import Wrapper from './Wrapper.svelte';
  import Input from './Input.svelte';
  import TextInput from './TextInput.svelte';

  export let hex: string;
</script>

<div class="wrapper">
  <ColorPicker
    components={{
      wrapper: Wrapper,
      input: Input,
      textInput: TextInput
    }}
    label=""
    bind:hex={hex}
    isAlpha={false}
  />
</div>

<style>
  .wrapper {
		--cp-text-color: rgb(var(--m3-scheme-on-background));
		--cp-input-color: rgb(var(--m3-scheme-background));
		--cp-button-hover-color: rgb(var(--m3-scheme-surface-container-lowest));
    --slider-width: 15px;
    --input-size: 36px;
    --focus-color: rgb(var(--m3-scheme-primary));

    ---thumb-border: 1px solid transparent;
  }
</style>