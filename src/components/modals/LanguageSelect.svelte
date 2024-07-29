<script lang="ts">
  import { SmallModalBody } from "@component-utils";
  import { RadioInput } from "@interactables";
  import { getLanguageName, selectedLanguage, t } from "@stores/Locale";
  import { showSelectLanguage } from "@stores/Modals";
  import { LANGS } from "@utils";

  let open = true;

  /**
   * Sets the app language.
   * @param lang The new language.
   */
  function setLanguage(lang: string) {
    $selectedLanguage = lang;
    open = false;
  }

  const langs: string[] = Object.keys(LANGS);
</script>

<SmallModalBody open={open} headline={$t("LANGUAGE_TITLE")} on:close={() => open = false} on:closeEnd={() => $showSelectLanguage = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    {#each langs as lang}
      <label style="height: 2.5rem;">
        <RadioInput name="appLanguage" checked={$selectedLanguage === lang} on:input={() => setLanguage(lang)} />
        <div class="radio font-label">{$getLanguageName(lang)}</div>
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
    margin-left: 5px;
  }
</style>