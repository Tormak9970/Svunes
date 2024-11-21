<script lang="ts">
  import { ModalBody } from "@component-utils";
  import { SettingsController } from "@controllers";
  import { Button, Select, TextField } from "@interactables";
  import { t } from "@stores/Locale";
  import { showAddProfile } from "@stores/Modals";
  import { profiles } from "@stores/State";

  let open = true;

  let profileName = "Profile #" + ($profiles.length + 1);
  let profileToCopy = "None";

  let options = $profiles.map((profile) => {
    return {
      label: profile,
      value: profile
    };
  });

  options.unshift({ label: "None", value: "None" });

  function create() {
    SettingsController.createProfile(profileName, profileToCopy === "None" ? null : profileToCopy);
    open = false;
  }
</script>

<ModalBody open={open} headline={$t("ADD_PROFILE_TITLE")} on:close={() => open = false} on:closeEnd={() => $showAddProfile = false}>
  <div class="content" style:--m3-util-background="var(--m3-scheme-surface-container-high)">
    <TextField name="Profile Name" bind:value={profileName} />
    <!-- TODO: select for the profile to base it off of -->
    <Select name="Profile to Copy" options={options} bind:value={profileToCopy} />
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