<script lang="ts">
  import { ModalBody, ProfileEntry } from "@component-utils";
  import { SettingsController } from "@controllers";
  import { scrollShadow } from "@directives";
  import { Button } from "@interactables";
  import { t } from "@stores/Locale";
  import { showAddProfile, showManageProfiles } from "@stores/Modals";
  import { currentProfile, profiles } from "@stores/State";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";

  let profilesUnsub: Unsubscriber;

  let open = true;

  let currentProfiles = [ ...$profiles ];
  let activeProfileIndex = currentProfiles.indexOf($currentProfile);
  let renamedActive = false;
  let editing = false;

  function renameProfile(index: number, value: string) {
    editing = false;
    currentProfiles[index] = value;
    currentProfiles = [ ...currentProfiles ];

    if (index === activeProfileIndex) renamedActive = true;
  }

  function deleteProfile(index: number) {
    currentProfiles.splice(index, 1);
    currentProfiles = [ ...currentProfiles ];
  }

  function done() {
    $profiles = [ ...currentProfiles ];

    if (renamedActive) {
      SettingsController.renameProfile($currentProfile, currentProfiles[activeProfileIndex]);
    }

    open = false;
  }

  onMount(() => {
    profilesUnsub = profiles.subscribe((options) => {
      currentProfiles = [ ...options ];
    });
  });
  onDestroy(() => {
    if (profilesUnsub) profilesUnsub();
  });
</script>

<ModalBody open={open} headline={$t("MANAGE_PROFILES_TITLE")} on:close={() => open = false} on:closeEnd={() => $showManageProfiles = false}>
  <div class="content styled-scrollbar" use:scrollShadow>
    <div class="content-wrapper">
      {#each currentProfiles as profile, i}
        <ProfileEntry
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
      <Button type="text" on:click={() => $showAddProfile = true}>{$t("ADD_ACTION")}</Button>
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