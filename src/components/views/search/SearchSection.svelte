<script lang="ts">
  export let label: string;
</script>

<div class="section-header">{label.toLocaleUpperCase()}</div>

<style>
  .section-header {
    font-size: 13px;
    color: rgb(var(--m3-scheme-primary));

    width: calc(100% - 1rem);
    margin-left: 0.5rem;
    margin-top: 10px;
  }
</style>