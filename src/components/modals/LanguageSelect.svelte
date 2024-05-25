<script lang="ts">
  import Body from "./view-settings/Body.svelte";
  import { selectedLanguage } from "../../stores/State";
  import { showSelectLanguage } from "../../stores/Modals";
  import RadioInput from "../interactables/RadioInput.svelte";
  import { APP_LANGUAGE, getLanguage } from "../../types/Settings";

  /**
   * Sets the app language.
   * @param lang The new language.
   */
  function setLanguage(lang: APP_LANGUAGE) {
    $selectedLanguage = lang;
    $showSelectLanguage = false;
  }

  const langs: APP_LANGUAGE[] = Object.values(APP_LANGUAGE).filter((v) => !isNaN(Number(v))) as APP_LANGUAGE[];
</script>

<Body headline="Select Language" bind:open={$showSelectLanguage}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    {#each langs as lang}
      <label style="height: 2.5rem;">
        <RadioInput name="appLanguage" checked={$selectedLanguage === lang} on:input={() => setLanguage(lang)} />
        <div class="radio">{getLanguage(lang)}</div>
      </label>
    {/each}
  </div>
</Body>

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