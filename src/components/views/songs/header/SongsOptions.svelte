<script lang="ts">
  import ArrowRight from "../../../icons/ArrowRight.svelte";
</script>

<md-sub-menu style="width: 150px;">
  <md-menu-item slot="item">
    <div slot="headline">Grid Size</div>
    <!-- Arrow icons are helpful affordances -->
    <div slot="end" style="width: 24px;">
      <ArrowRight />
    </div>
  </md-menu-item>
  <!-- Submenu must be slotted into sub-menu's menu slot -->
  <md-menu slot="menu" menu-corner="start-end" anchor-corner="start-start" positioning="popover">
    <div class="sub-menu-header">Grid Size</div>
    <md-menu-item>
      <div slot="headline">
        <!-- <md-radio id="cats-radio" name="animals" value="cats"></md-radio>
        <label for="cats-radio">Cats</label>

        <md-radio id="dogs-radio" name="animals" value="dogs"></md-radio>
        <label for="dogs-radio">Dogs</label> -->
      </div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Avocado</div>
    </md-menu-item>
  </md-menu>
</md-sub-menu>
<md-menu-item>
  <div slot="headline">Grid Style</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Sort Order</div>
</md-menu-item>
<md-menu-item>
  <div slot="headline">Settings</div>
</md-menu-item>

<style>
  .sub-menu-header {
    font-size: 14px;
    color: var(--md-sys-color-on-surface-variant);

    margin-left: 10px;
    margin-bottom: 5px;
  }
</style>