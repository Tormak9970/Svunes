<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";

  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";

  export let label: string;
  export let goBack: () => void;
</script>

<OverlayHeader highlight={false}>
  <span slot="left" style="display: flex; align-items: center;">
    <Button type="text" iconType="full" on:click={goBack}>
      <Icon icon={BackArrow} width="20px" height="20px" />
    </Button>
    <div style="margin-left: 10px; font-size: 20px;">{label}</div>
  </span>
  <span slot="right" />
</OverlayHeader>