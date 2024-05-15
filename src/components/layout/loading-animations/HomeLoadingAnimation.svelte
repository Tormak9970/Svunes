<script lang="ts">
  import { fade } from "svelte/transition";
</script>

<div class="home-loader" in:fade>
  <div class="icon">
    <span />
    <span />
    <span />
    <span />
    <span />
  </div>
  
</div>

<style>
  .home-loader {
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 40px;
    height: 40px;
  }

  .icon span {
    width: 4px;
    height: 100%;
    background-color: rgb(var(--m3-scheme-on-secondary-container));
    border-radius: 2px;
    content: '';
    transform-origin: bottom;
    animation: bounce 2.2s ease infinite alternate;
    content: '';
  }

  @keyframes bounce {
    10% {
      transform: scaleY(0.3); /* start by scaling to 30% */
    }

    30% {
      transform: scaleY(1); /* scale up to 100% */
    }

    60% {
      transform: scaleY(0.5); /* scale down to 50% */
    }

    80% {
      transform: scaleY(0.75); /* scale up to 75% */
    }

    100% {
      transform: scaleY(0.6); /* scale down to 60% */
    }
  }

  span:nth-of-type(2) {
    animation-delay: -2.2s;
  }

  span:nth-of-type(3) {
    animation-delay: -3.7s;
  }
  
  span:nth-of-type(4) {
    animation-delay: -5.2s;
  }
  
  span:nth-of-type(5) {
    animation-delay: 0.2s;
  }


</style>