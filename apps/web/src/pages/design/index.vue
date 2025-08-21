<template>
  <MainWrapper>
    <template #sub-header>
      <div class="bg-red-200">Test Slot #sub-header</div>
      <ToggleTheme />
    </template>

    <MainContent class="h-max gap-5">
      <h1 class="text-3xl font-bold sticky top-0">DESIGN VIEW</h1>
      <div :class="ui.buttonWrapper">
        <div :class="ui.buttonContainer">
          <ButtonUI size="icon">x</ButtonUI>
          <ButtonUI size="sm">Button 2</ButtonUI>
          <ButtonUI size="md">Button 3</ButtonUI>
          <ButtonUI size="lg">Button 4</ButtonUI>
        </div>
        <div :class="ui.buttonContainer">
          <ButtonUI size="icon">x</ButtonUI>
          <ButtonUI size="sm" variant="secondary">Button 2</ButtonUI>
          <ButtonUI size="md">Button 3</ButtonUI>
          <ButtonUI size="lg" variant="secondary">Button 4</ButtonUI>
        </div>
      </div>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { MainContent, MainWrapper, ToggleTheme } from "@/components";
import { ButtonUI } from "@/components/ui";
definePage({ meta: { requiresAuth: true, roles: ["admin"] } });

const ui = {
  buttonWrapper: "flex flex-col w-[50%] gap-5",
  buttonContainer: "flex justify-between items-center gap-5",
};
</script>

<style scoped lang=""></style>
