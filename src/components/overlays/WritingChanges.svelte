<script>
  import { LoadingSpinner } from "@layout";
</script>

<div class="writing-changes-dialog">
  <LoadingSpinner />
</div>

<style>
  .writing-changes-dialog {
    position: absolute;
    z-index: 4;

    background-color: rgb(var(--m3-scheme-scrim) / 0.7);
    
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>