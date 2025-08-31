<template>
  <div :class="ui.wrapper">
    <div role="button" :class="ui.icon">
      <VueIcon role="button" :class="ui.icon" name="mdi:number-1"></VueIcon>
    </div>

    <div role="button" :class="ui.icon">
      <VueIcon role="button" :class="ui.icon" name="mdi:number-2"></VueIcon>
    </div>

    <div role="button" :class="ui.icon">
      <VueIcon role="button" :class="ui.icon" name="mdi:number-3"></VueIcon>
    </div>

    <div role="button" :class="ui.icon">
      <VueIcon role="button" :class="ui.icon" name="mdi:number-4"></VueIcon>
    </div>

    <div role="button" :class="ui.icon">
      <VueIcon role="button" :class="ui.icon" name="mdi:number-5"></VueIcon>
    </div>

    <div role="button" :class="ui.icon">
      <VueIcon role="button" :class="ui.icon" name="mdi:number-6"></VueIcon>
    </div>

    <div role="button" :class="ui.icon">
      <VueIcon role="button" :class="ui.icon" name="mdi:number-7"></VueIcon>
    </div>

    <div role="button" :class="ui.icon">
      <VueIcon role="button" :class="ui.icon" name="mdi:number-8"></VueIcon>
    </div>

    <div role="button" :class="ui.icon">
      <VueIcon role="button" :class="ui.icon" name="mdi:number-9"></VueIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
const ui = {
  wrapper: [
    "flex items-center justify-between rounded-md",
    "transition-all duration-200 ease-in-out",
    " sm:w-100 p-1 pl-2 pr-2",
    "bg-dTheme-surfaceOther",
  ],
  icon: ["w-7 h-7 sm:w-9 sm:h-9 ", "sm:hover:bg-dTheme-light/10 rounded-md"],
};
</script>

<style scoped></style>
