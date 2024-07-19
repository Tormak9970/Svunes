<script lang="ts">
  export let label: string;
  export let marginLeft = "65px";
</script>

<div class="font-body-medium section-header" style:margin-left={marginLeft}>{label.toLocaleUpperCase()}</div>

<style>
  .section-header {
    color: rgb(var(--m3-scheme-primary));

    width: calc(100% - 65px);
    margin-top: 10px;
  }
</style>