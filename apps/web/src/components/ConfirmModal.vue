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
    <template #footer>
      <div class="flex gap-5">
        <ButtonUI
          size="sm"
          variant="secondary"
          @click="
            emit('onSecondaryAction');
            innerShow = false;
          "
          >{{ secondaryActionLabel }}</ButtonUI
        >
        <ButtonUI
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
    mainActionLabel: "Confirm",
    secondaryActionLabel: "Cancel",
  }
);

const emit = defineEmits<{
  onMainAction: [];
  onSecondaryAction: [];
}>();

const innerShow = defineModel<boolean>("show");
</script>

<style scoped lang=""></style>
