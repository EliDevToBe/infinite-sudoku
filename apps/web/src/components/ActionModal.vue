<template>
  <LazyModalUI
    :title="title"
    :description="description"
    v-model:show="innerShow"
    @on-close="emit('onSecondaryAction')"
  >
    <template #body>
      <slot></slot>
    </template>
    <template #footer v-if="mainActionLabel || secondaryActionLabel">
      <div class="flex gap-5">
        <ButtonUI
          v-if="secondaryActionLabel"
          size="sm"
          variant="secondary"
          @click="
            emit('onSecondaryAction');
            innerShow = false;
          "
          >{{ secondaryActionLabel }}</ButtonUI
        >
        <ButtonUI
          v-if="mainActionLabel"
          size="sm"
          variant="primary"
          @click="
            emit('onMainAction');
            innerShow = false;
          "
          >{{ mainActionLabel }}</ButtonUI
        >
      </div>
    </template>
  </LazyModalUI>
</template>

<script setup lang="ts">
import { LazyModalUI } from "@/components";

const props = withDefaults(
  defineProps<{
    title?: string;
    description: string;
    mainActionLabel?: string;
    secondaryActionLabel?: string;
  }>(),
  {
    title: "Are you sure ?",
  }
);

const emit = defineEmits<{
  onMainAction: [];
  onSecondaryAction: [];
}>();

const innerShow = defineModel<boolean>("show");
</script>

<style scoped lang=""></style>
