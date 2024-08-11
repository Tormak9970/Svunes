<script lang="ts">
  import { Icon } from "@component-utils";
  import { Close } from "@icons";
  import { Button } from "@interactables";
  import { ViewHeader } from "@layout";
  import { t } from "@stores/Locale";
  import { selected } from "@stores/Select";
</script>

<div class="select-header-container">
  <ViewHeader title="{$selected.length} {$t("SELECTED_VALUE")}" highlight>
    <span slot="left">
      <Button type="text" iconType="full" on:click={() => $selected = []}>
        <Icon icon={Close} width="20px" height="20px" />
      </Button>
    </span>
    <span slot="right" style="display: flex; flex-direction: row;">
      
    </span>
  </ViewHeader>
</div>

<style>
  .select-header-container {
    border-radius: 10px;

    width: 100%;

    overflow: hidden;

    margin-bottom: 0.5rem;
  }
</style>