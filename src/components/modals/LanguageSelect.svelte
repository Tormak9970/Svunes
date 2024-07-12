<script lang="ts">
  import RadioInput from "@interactables/radio/RadioInput.svelte";
  import { showSelectLanguage } from "@stores/Modals";
  import { selectedLanguage } from "@stores/State";
  import { AppLanguage, getLanguage } from "../../types/Settings";
  import SmallModalBody from "./utils/SmallModalBody.svelte";

  let open = true;

  /**
   * Sets the app language.
   * @param lang The new language.
   */
  function setLanguage(lang: AppLanguage) {
    $selectedLanguage = lang;
    open = false;
  }

  const langs: AppLanguage[] = Object.values(AppLanguage).filter((v) => !isNaN(Number(v))) as AppLanguage[];
</script>

<SmallModalBody open={open} headline="Select Language" on:close={() => open = false} on:closeEnd={() => $showSelectLanguage = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    {#each langs as lang}
      <label style="height: 2.5rem;">
        <RadioInput name="appLanguage" checked={$selectedLanguage === lang} on:input={() => setLanguage(lang)} />
        <div class="radio">{getLanguage(lang)}</div>
      </label>
    {/each}
  </div>
</SmallModalBody>

<style>
  .content {
    display: flex;
    flex-direction: column;
  }

  label {
    display: flex;
    align-items: center;
  }

  .radio {
    margin-left: 15px;
    font-size: 16px;
  }
</style>