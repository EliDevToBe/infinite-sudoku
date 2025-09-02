<template>
  <VueModal
    :title="title"
    :description="description"
    :ui="ui"
    v-model:open="showModel"
    @update:open="(event) => emit('onClose')"
  >
    <template #body v-if="$slots.body">
      <slot name="body"></slot>
    </template>

    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </VueModal>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  onClose: [];
}>();

const props = defineProps<{
  title: string;
  description: string;
}>();

const ui = {
  overlay:
    "bg-[linear-gradient(to_bottom,rgba(50,71,83,0.6)_0%,rgba(32,47,55,0.6)_100%)] backdrop-blur-[4px]",
  content: [
    "bg-[linear-gradient(to_bottom,rgba(50,71,83,1)_0%,rgba(32,47,55,1)_100%)]  shadow-xs shadow-dTheme-accent",
    "border-t-1 border-t-dTheme-light",
    "border-l-1 border-l-dTheme-light/80 ",
    "border-r-1 border-r-dTheme-light/80",
  ],
  title: "text-dTheme-font sm:text-3xl text-2xl",
  header: "flex items-center gap-1.5 p-2 px-4 sm:px-6 min-h-16",
  close: "rounded-lg hover:bg-red-800",
  body: "border-t-1 border-t-dTheme-light/80 p-4 sm:p-6",
  footer: "border-t-1 border-t-dTheme-light/65 gap-1.5 p-2 px-4 sm:px-6 flex",
};

const showModel = defineModel<boolean>("show");
</script>

<style scoped lang=""></style>
