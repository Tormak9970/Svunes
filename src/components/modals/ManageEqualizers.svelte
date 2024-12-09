<script lang="ts">
  import { ManagedEntry, ModalBody } from "@component-utils";
  import { SettingsController } from "@controllers";
  import { scrollShadow } from "@directives";
  import { Button } from "@interactables";
  import { t } from "@stores/Locale";
  import { showAddEq, showManageEqs } from "@stores/Modals";
  import { currentEq, equalizers } from "@stores/State";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";

  let eqsUnsub: Unsubscriber;

  let open = true;

  let currentEqs = Object.keys($equalizers);
  let activeEqIndex = currentEqs.indexOf($currentEq);
  let renamedActive = false;
  let editing = false;

  function renameProfile(index: number, value: string) {
    editing = false;
    currentEqs[index] = value;
    currentEqs = [ ...currentEqs ];

    if (index === activeEqIndex) renamedActive = true;
  }

  function deleteProfile(index: number) {
    currentEqs.splice(index, 1);
    currentEqs = [ ...currentEqs ];
  }

  function done() {
    for (const eq of Object.keys($equalizers)) {
      if (!currentEqs.includes(eq)) {
        delete $equalizers[eq];
      }
    }

    $equalizers = { ...$equalizers };

    if (renamedActive) {
      SettingsController.renameEqualizer($currentEq, currentEqs[activeEqIndex]);
    }

    open = false;
  }

  onMount(() => {
    eqsUnsub = equalizers.subscribe((eqs) => {
      currentEqs = Object.keys(eqs);
    });
  });
  onDestroy(() => {
    if (eqsUnsub) eqsUnsub();
  });
</script>

<ModalBody open={open} headline={$t("MANAGE_EQUALIZERS_TITLE")} on:close={() => open = false} on:closeEnd={() => $showManageEqs = false}>
  <div class="content styled-scrollbar" use:scrollShadow>
    <div class="content-wrapper">
      {#each currentEqs as profile, i}
        <ManagedEntry
          label={profile}
          index={i}
          editable={profile !== "Default" && !editing}
          deletable={profile !== "Default" && !editing}
          onEdit={renameProfile}
          onDelete={deleteProfile}
          on:editStart={() => editing = true}
          on:editEnd={() => editing = false}
        />
      {/each}
    </div>
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={() => $showAddEq = true}>{$t("ADD_ACTION")}</Button>
      <Button type="text" on:click={done}>{$t("DONE_ACTION")}</Button>
    </div>
  </div>
</ModalBody>

<style>
  .content {
    max-height: 20rem;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .content-wrapper {
    width: 20rem;
    height: fit-content;

    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>