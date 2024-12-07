<script lang="ts">
  import { ModalBody } from "@component-utils";
  import { SettingsController } from "@controllers";
  import { Button, Select, TextField } from "@interactables";
  import { t } from "@stores/Locale";
  import { showAddEq } from "@stores/Modals";
  import { equalizers } from "@stores/State";

  let open = true;
  
  let eqNames = Object.keys($equalizers);

  let eqName = "Equalizer #" + (eqNames.length + 1);
  let eqToCopy = "None";

  let options = eqNames.map((eq) => {
    return {
      label: eq,
      value: eq
    };
  });

  options.unshift({ label: "None", value: "None" });

  function create() {
    SettingsController.createEqualizer(eqName, eqToCopy === "None" ? null : eqToCopy);
    open = false;
  }
</script>

<ModalBody open={open} headline={$t("ADD_EQUALIZER_TITLE")} on:close={() => open = false} on:closeEnd={() => $showAddEq = false}>
  <div class="content" style:--m3-util-background="var(--m3-scheme-surface-container-high)">
    <TextField name={$t("EQUALIZER_NAME_LABEL")} bind:value={eqName} />
    <Select name={$t("EQUALIZER_COPY_LABEL")} options={options} bind:value={eqToCopy} />
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={create}>{$t("CREATE_ACTION")}</Button>
      <Button type="text" on:click={() => open = false}>{$t("CANCEL_ACTION")}</Button>
    </div>
  </div>
</ModalBody>

<style>
  .content {
    max-height: 20rem;
    height: fit-content;
    width: 20rem;

    display: flex;
    flex-direction: column;
    
    gap: 1rem;
  }

  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>