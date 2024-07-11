<script lang="ts">
  export let value: string;
</script>

<md-select-option value={value}>
  <div slot="headline">
    <slot />
  </div>
</md-select-option>