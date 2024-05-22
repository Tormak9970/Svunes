<div class:container={true} use:load class={rootClass} style="height: {rootInitialHeight};">
  {#if clickable}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="click-container" on:click={() => dispatch("click")}>
      <slot name="click-container" />
    </div>
  {/if}
  {#if loaded}
    {#if !failed}
      <div
        in:fade={fadeOption || {}}
        class={contentClass}
        style={contentStyle}
      >
        <slot onError={onError}>Lazy load content</slot>
      </div>
    {/if}
    {#if !contentShow || failed}
      <slot name="placeholder" />
    {/if}
  {:else}
    <slot name="placeholder" />
  {/if}
</div>

<style>
  .container {
    position: relative;
  }

  .click-container {
    position: absolute;
    top: 0;

    cursor: pointer;

    width: 100%;
    height: 100%;

    z-index: 2;

    background-color: transparent;
    transition: background-color 0.2s ease-in-out;
  }

  .container:hover .click-container {
    background-color: rgb(var(--m3-scheme-scrim) / 0.3);
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from 'svelte/transition';
  export let keep = false;
  export let height = 0;
  export let offset = 150;
  export let fadeOption = {
    delay: 0,
    duration: 400,
  };
  export let resetHeightDelay = 0;
  export let onload: any = null;
  export let clickable = false;
  const onError = () => { failed = true; }
  
  let className = '';
  export { className as class };

  const rootClass = 'svelte-lazy'
    + (className ? ' ' + className : '');
  const contentClass = 'svelte-lazy-content';
  const rootInitialHeight = getStyleHeight();
  let loaded = false;
  let failed = false;

  let contentShow = true;
  $: contentStyle = !contentShow ? 'display: none' : '';

  const dispatch = createEventDispatcher();

  function load(node: HTMLElement) {
    setHeight(node);
    const handler = createHandler(node);
    addListeners(handler);
    setTimeout(() => {
      handler();
    });
    const observer = observeNode(node);

    return {
      destroy: () => {
        removeListeners(handler);
        observer.unobserve(node);
      },
    };
  }

  function createHandler(node: HTMLElement) {
    const handler = throttle((e: any) => {
      const nodeTop = node.getBoundingClientRect().top;
      const nodeBottom = node.getBoundingClientRect().bottom;
      const expectedTop = getContainerHeight(e) + offset;

      if (nodeTop <= expectedTop && nodeBottom > 0) {
        loadNode(node);
      } else if (!keep) {
        unload(node)
      }
    }, 200);
    return handler;
  }

  function observeNode(node: HTMLElement) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadNode(node);
      }
    })
    observer.observe(node);
    return observer;
  }

  function unload(node: HTMLElement) {
    setHeight(node);
    loaded = false
  }

  function loadNode(node: HTMLElement) {
    if (loaded) {
      return;
    }

    loaded = true;
    resetHeight(node);
    if (onload) {
      onload(node);
    }
  }

  function addListeners(handler: any) {
    document.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
  }

  function removeListeners(handler: any) {
    document.removeEventListener('scroll', handler, true);
    window.removeEventListener('resize', handler);
  }

  function getStyleHeight() {
    return (typeof height === 'number')
      ? height + 'px'
      : height;
  }

  function setHeight(node: HTMLElement) {
    if (height) {
      node.style.height = getStyleHeight();
    }
  }

  function resetHeight(node: HTMLElement) {
    setTimeout(() => {
      const isLoading = checkImgLoadingStatus(node);
      if (!isLoading) {
        node.style.height = 'auto';
      }
    // Add a delay to wait for remote resources like images to load
    }, resetHeightDelay);
  }

  function checkImgLoadingStatus(node: HTMLElement) {
    const img = node.querySelector('img');
    if (!img) {
      return false
    }

    if (!img.complete) {
      contentShow = false;

      node.addEventListener('load', () => {
        // Use auto height if loading successfully
        contentShow = true;
        node.style.height = 'auto';
      }, { capture: true, once: true });

      node.addEventListener('error', () => {
        // Show content with fixed height if there is error
        contentShow = true;
      }, { capture: true, once: true });

      return true;
    } else if (img.complete && !img.src) {
      failed = true;
    }

    if (img.naturalHeight === 0) {
      // Use fixed height if img has zero height
      return true;
    }

    return false;
  }

  function getContainerHeight(e: any) {
    if (e?.target?.getBoundingClientRect) {
      return e.target.getBoundingClientRect().bottom;
    } else {
      return window.innerHeight;
    }
  }

  // From underscore souce code
  function throttle(func: any, wait: number, options?: any) {
    let context: any, args: any, result: any;
    let timeout: any = null;
    let previous: any = 0;
    if (!options) options = {};
    const later = function() {
      previous = options.leading === false ? 0 : new Date();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    return function() {
      const now = new Date();
      if (!previous && options.leading === false) previous = now;
      // @ts-ignore
      const remaining = wait - (now - previous);
      // @ts-ignore
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }
</script>