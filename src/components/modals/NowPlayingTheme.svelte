<script lang="ts">
  import { ModalBody } from "@component-utils";
  import Button from "@interactables/Button.svelte";
  import Lazy from "@layout/Lazy.svelte";
  import { t } from "@stores/Locale";
  import { showNowPlayingTheme } from "@stores/Modals";
  import { nowPlayingTheme } from "@stores/State";
  import { getNowPlayingTheme, NowPlayingTheme } from "@types";
  import { IMAGE_FADE_OPTIONS } from "@utils";
  import { onDestroy, onMount } from "svelte";
  import { drag } from "svelte-gesture";
  import { spring } from "svelte/motion";
  import type { Unsubscriber } from "svelte/store";

  let open = true;

  let nowPlayingUnsub: Unsubscriber;
  let selectedTheme = $nowPlayingTheme;
  
  const dragThreshold = 10;
  let xOffset = 0
  const dragOffset = spring(0, {});

  const imageWidth = 190.83;
  const imageGap = 30;

  const themesConfig = (Object.values(NowPlayingTheme).filter((v) => !isNaN(Number(v))) as NowPlayingTheme[]).map((theme) => {
    const label = getNowPlayingTheme(theme);
    return {
      "label": label,
      "src": `np_${label.toLowerCase()}.png`,
      "theme": theme as NowPlayingTheme
    }
  });
  
  function handleDrag({ detail }: any) {
		const { active, movement: [mx], swipe: [swipeX] } = detail;

    if (mx > 0 && selectedTheme === NowPlayingTheme.NORMAL) return;
    if (mx < 0 && selectedTheme === NowPlayingTheme.FULL) return;

    const shouldMoveLeft = mx > dragThreshold;
    if ((swipeX === -1 || shouldMoveLeft) && !active) {
      selectedTheme--;
      xOffset = -1 * (imageGap + imageWidth) * selectedTheme;
    }

    const shouldMoveRight = mx < -1 * dragThreshold;
    if ((swipeX === 1 || shouldMoveRight) && !active) {
      selectedTheme++;
      xOffset = -1 * (imageGap + imageWidth) * selectedTheme;
    }

		dragOffset.set(xOffset + (active ? mx : 0));
	}

  /**
   * Saves the user's changes
   */
  function done() {
    $nowPlayingTheme = selectedTheme;
    open = false;
  }

  onMount(() => {
    nowPlayingUnsub = nowPlayingTheme.subscribe((theme) => {
      selectedTheme = theme;
      xOffset = -1 * (imageGap + imageWidth) * selectedTheme;
      dragOffset.set(xOffset);
    });
  });

  onDestroy(() => {
    if (nowPlayingUnsub) nowPlayingUnsub();
  });
</script>

<ModalBody open={open} headline={$t("NOW_PLAYING_THEME_TITLE")} on:close={() => open = false} on:closeEnd={() => $showNowPlayingTheme = false}>
  <div class="content">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="themes-container" style:left="{20 + $dragOffset}px" use:drag on:drag={handleDrag}>
      {#each themesConfig as config}
        <div class="theme">
          <div class="font-label label">{config.label}</div>
          <div class="preview">
            <Lazy height={400} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
              <!-- svelte-ignore a11y-missing-attribute -->
              <img src="/images/{config.src}" style="width: auto; height: 400px;" draggable="false" on:error={onError} />
            </Lazy>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={done}>{$t("SAVE_ACTION")}</Button>
    </div>
  </div>
</ModalBody>

<style>
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .left {
    margin-right: 65px;
  }

  .content {
    height: 420px;

    position: relative;

    user-select: none;
  }

  .themes-container {
    position: absolute;
    left: 0;

    display: flex;
    gap: 30px;

    touch-action: none;
  }

  .theme {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .label {
    margin-bottom: 10px;
  }

  .preview {
    height: 400px;
    overflow: hidden;
    border-radius: 10px;
  }
</style>