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
      <div
        class="flex items-center gap-5 w-full max-sm:justify-around justify-end"
      >
        <ButtonUI
          v-if="secondaryActionLabel"
          size="sm"
          variant="secondary"
          @click="emit('onSecondaryAction')"
          >{{ secondaryActionLabel }}</ButtonUI
        >
        <ButtonUI
          v-if="mainActionLabel"
          size="md"
          variant="primary"
          :class="
            specialMainAction
              ? 'animate-rotating-border shadow-dTheme-accent!'
              : ''
          "
          @click="emit('onMainAction')"
          >{{ mainActionLabel }}</ButtonUI
        >
      </div>
    </template>
  </LazyModalUI>
</template>

<script setup lang="ts">
import { LazyModalUI } from "@/components";

const props = defineProps<{
  title: string;
  description: string;
  mainActionLabel?: string;
  secondaryActionLabel?: string;
  specialMainAction?: boolean;
}>();

const emit = defineEmits<{
  onMainAction: [];
  onSecondaryAction: [];
}>();

const innerShow = defineModel<boolean>("show");
</script>

<style scoped lang="css">
@property --border-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes border-angle-rotate {
  from {
    --border-angle: -60deg;
  }
  to {
    --border-angle: 300deg;
  }
}

.animate-rotating-border {
  --border-angle: -60deg;
  border: 1px solid transparent;
  animation: border-angle-rotate 6s infinite linear;

  background: linear-gradient(
        /* var(--colors-dTheme-surfaceOther), */
          var(--colors-dTheme-surfaceOther)
      )
      padding-box,
    conic-gradient(
        from var(--border-angle),
        var(--colors-dTheme-accent) 10%,
        color-mix(in srgb, var(--colors-dTheme-light) 92%, transparent)
      )
      border-box;
}

.animate-rotating-border:hover {
  animation: border-angle-rotate 1.5s infinite linear;

  background: linear-gradient(var(--colors-dTheme-surfaceOther)) padding-box,
    conic-gradient(
        from var(--border-angle),
        var(--colors-dTheme-accent) 10%,
        var(--colors-dTheme-light)
      )
      border-box;
}

.animate-rotating-border:active {
  background: linear-gradient(var(--colors-dTheme-surface)) padding-box,
    conic-gradient(
        from var(--border-angle),
        var(--colors-dTheme-accent) 10%,
        var(--colors-dTheme-light)
      )
      border-box;
}
</style>
