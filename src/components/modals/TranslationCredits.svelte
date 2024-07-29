<script lang="ts">
  import { scrollShadow } from "@directives";
  import Button from "@interactables/Button.svelte";
  import { getCredits, getLanguageName, t } from "@stores/Locale";
  import { showTranslationCredits } from "@stores/Modals";
  import { LANGS } from "@utils";
  import ModalBody from "./utils/ModalBody.svelte";

  let open = true;

  const langs: string[] = Object.keys(LANGS);
  langs.splice(0, 1);
  const credits = langs.map((lang) => getCredits(lang));
</script>

<ModalBody open={open} headline={$t("TRANSLATION_CREDITS_TITLE")} on:close={() => open = false} on:closeEnd={() => $showTranslationCredits = false}>
 <div class="content styled-scrollbar" use:scrollShadow>
    <div class="content-wrapper">
      {#each langs as lang, i}
        <div class="entry">
          <div class="font-label lang">{$getLanguageName(lang)}</div>
          <div class="font-body">{credits[i].length === 0 ? $t("NONE_VALUE") : credits[i].join(", ")}</div>
        </div>
      {/each}
    </div>
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={() => open = false }>{$t("CLOSE_ACTION")}</Button>
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
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }


  .lang {
    font-weight: bold;
  }
  
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>