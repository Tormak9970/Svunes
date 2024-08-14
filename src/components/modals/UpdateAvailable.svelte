<script lang="ts">
  import { ModalBody } from "@component-utils";
  import { LogController } from "@controllers";
  import { Button } from "@interactables";
  import { selectedLanguage, systemDefaultLanguage, t } from "@stores/Locale";
  import { showUpdateModal, updateData } from "@stores/Modals";
  import { showErrorSnackbar } from "@stores/State";
  import { relaunch } from "@tauri-apps/plugin-process";
  import { open as openLink } from "@tauri-apps/plugin-shell";
  import type { DownloadEvent } from "@tauri-apps/plugin-updater";
  import MarkdownIt from "markdown-it";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import ProgressIndicator from "../interactables/ProgressIndicator.svelte";

  const mdIt = new MarkdownIt({
    html: true,
    linkify: true
  });

  let open = true;
  let step: "changelog" | "download" | "restart" = "changelog";
  let formattedDate = "No date provided";

  const stepHeight = {
    changelog: 390,
    download: 122,
    restart: 135
  }

  let contentLength = 0;
  let downloaded = 0;
  
  /**
   * Handles click events to redirect to the browser.
   * @param e The click event.
   */
  function linkClick(e: Event): void {
    const origin = (e.target as Element).closest("a");
  
    if (origin) {
      e.preventDefault();
      const href = origin.href;
      openLink(href);
    }
  }

  function downloadUpdate() {
    LogController.log(`Downloading update v${$updateData!.version}, released on ${$updateData!.date}.`);

    try {
      $updateData!.download((event: DownloadEvent) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength!;
            downloaded = 0;
            step = "download";
            break;
          case 'Progress':
            downloaded += event.data.chunkLength!;
            break;
          case 'Finished':
            step = "restart";
            break;
        }
      });
    } catch (e: any) {
      $showErrorSnackbar({ message: $t("UPDATE_DOWNLOAD_ERROR_MESSAGE") });
    }
  }

  async function installUpdate(): Promise<void> {
    LogController.log(`Installing update v${$updateData!.version}, released on ${$updateData!.date}.`);

    // Install the update. This will also restart the app on Windows!
    await $updateData!.install();

    // On macOS and Linux you will need to restart the app manually.
    // You could use this step to display another confirmation dialog.
    await relaunch();
  }

  onMount(() => {
    const dateString = $updateData?.date;

    if (dateString) {
      const lang = ($selectedLanguage === "system") ? $systemDefaultLanguage : $selectedLanguage;
      const formatter = new Intl.DateTimeFormat(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const date = new Date(dateString);
      formattedDate = formatter.format(date);
    }
  });
</script>

<ModalBody headline={$t("UPDATE_AVAILABLE_TITLE")} open={open} canClose={false} on:close={() => open = false} on:closeEnd={() => $showUpdateModal = false }>
  <div class="content" style:height="{stepHeight[step]}px">
    <div class="update-info">
      <div class="field">
        <div class="label">{$t("RELEASE_DATE_LABEL")}:</div>
        <div>{formattedDate}</div>
      </div>
      <div class="field">
        <div class="label">{$t("CURRENT_VERSION_LABEL")}:</div>
        <div>{$updateData?.currentVersion}</div>
      </div>
      <div class="field">
        <div class="label">{$t("NEW_VERSION_LABEL")}:</div>
        <div>{$updateData?.version}</div>
      </div>
    </div>
    {#if step === "changelog"}
      <div class="changelog styled-scrollbar" in:fade={{ duration: 300 }}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={linkClick}>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html mdIt.render($updateData?.body ?? "No update details found")}
        </div>
      </div>
    {:else if step === "download"}
      <div class="download-container" in:fade={{ duration: 300 }}>
        <ProgressIndicator percent={downloaded / (contentLength || 1) * 100} />
      </div>
    {:else}
      <div class="complete-message" in:fade={{ duration: 300 }}>
        {$t("UPDATE_DOWNLOAD_DONE_MESSAGE")}
      </div>
    {/if}
  </div>
  <div class="actions" slot="buttons">
    <div class="left">
      {#if step === "changelog"}
        <Button type="text" on:click={() => open = false }>{$t("SKIP_ACTION")}</Button>
      {:else if step === "restart"}
        <Button type="text" on:click={() => open = false }>{$t("LATER_ACTION")}</Button>
      {/if}
    </div>
    <div class="right">
      {#if step === "changelog"}
        <Button type="text" on:click={downloadUpdate}>{$t("DOWNLOAD_ACTION")}</Button>
      {:else if step === "restart"}
        <Button type="text" on:click={installUpdate}>{$t("NOW_ACTION")}</Button>
      {/if}
    </div>
  </div>
</ModalBody>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    min-width: 25rem;

    font-size: 1rem;

    transition: height 0.3s ease-in-out;
  }

  .update-info .field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .field .label {
    font-weight: bold;
  }

  .changelog {
    width: 100%;
    height: 40vh;

    border-radius: 10px;
    background-color: rgb(var(--m3-scheme-surface-container-low));
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .changelog > div {
    margin-bottom: 1rem;
  }

  :global(.changelog > div p) {
    margin-left: 0.5rem;
    margin-bottom: 0.1rem;
    font-weight: bold;
  }

  :global(.changelog > div ul) {
    margin: 0.3rem 0;
    padding-left: 2rem;
  }

  :global(.changelog > div li) {
    margin-bottom: 0.1rem;
  }

  :global(.changelog > div a) {
    color: rgb(var(--m3-scheme-primary));
  }
  :global(.changelog > div a:hover),
  :global(.changelog > div a:active) {
    color: rgb(var(--m3-scheme-on-primary-container));
  }

  .download-container {
    margin-top: 2rem;
    width: 100%;
  }
  .complete-message {
    margin-top: 1.5rem;
    width: 100%;
  }

  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>