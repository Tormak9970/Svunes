<script lang="ts">
  export let label: string;
</script>

<div class="font-body-medium section-header">{label.toLocaleUpperCase()}</div>

<style>
  .section-header {
    color: rgb(var(--m3-scheme-primary));

    width: calc(100% - 65px);
    margin-left: 65px;
    margin-top: 10px;
  }
</style>