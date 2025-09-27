<template>
  <div
    :class="[radioClass, model !== value ? 'inset' : '']"
    @click="model = value"
    tabindex="0"
    role="radio"
    :aria-labelledby="`${value}-label`"
    :aria-checked="model === value"
    @keydown="handleKeydown"
  >
    <input
      class="absolute"
      type="radio"
      :value="value"
      :name="radioGroup"
      appearance-none
      v-model="model"
      :checked="model === value"
      :id="value"
      tabindex="-1"
    />

    <template v-if="$slots.leadingSlot">
      <slot name="leadingSlot"></slot>
    </template>

    <label
      class="cursor-pointer max-sm:text-sm text-center place-self-center"
      :for="value"
      :id="`${value}-label`"
    >
      <span>
        {{ label }}
      </span>

      <template v-if="$slots.trailingSlot">
        <slot name="trailingSlot"></slot>
      </template>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Props = {
  value: string;
  radioGroup: string;
  label: string;
};

const props = withDefaults(defineProps<Props>(), {});
const model = defineModel<string>();

const ui = {
  base: "flex grow box-border p-0.5 sm:p-1 justify-center items-center cursor-pointer gap-2",
  active: "bg-dTheme-surface rounded-md",
};

const radioClass = computed(() => {
  return [ui.base, model.value === props.value ? ui.active : ""];
});

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    model.value = props.value;
  }
};
</script>

<style scoped lang="css">
@media (hover: hover) {
  .inset:hover {
    box-shadow: inset 0px -1px 0px var(--colors-lTheme-accent);
    transition: all 150 ease-in-out;
  }
}
</style>
