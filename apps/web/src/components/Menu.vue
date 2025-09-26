<template>
  <div :class="ui.wrapper">
    <DropDownUI v-model="items" :offset="10" side="top" align="center">
      <ButtonUI
        size="icon"
        iconSize="25"
        :class="ui.button"
        variant="ghost"
        leadingIcon="lucide:menu"
      >
      </ButtonUI>
    </DropDownUI>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { DropDownUI } from "@/components/ui";
import type { DropdownMenuItem } from "@nuxt/ui";
import { useAuth } from "@/composables/useAuth";

const ui = {
  wrapper: [
    "w-fit h-fit",

    "transition-all duration-150 ease-in-out",
    "hover:md:shadow-dTheme-accent shadow-sm rounded-lg",

    "border-t-1 sm:border-t-0.5 border-t-dTheme-light",
    "border-l-1 sm:border-l-0.5 border-l-dTheme-light/80 ",
    "border-r-1 sm:border-r-0.5 border-r-dTheme-light/80",
    "border-b-1 sm:border-b-0.5 border-b-dTheme-light/70",
  ],
  button: "text-dTheme-font sm:w-10! sm:h-10! w-8! h-8!",
};

const emit = defineEmits<{
  onLogin: [];
  onLogout: [];
  onMyAccount: [];
  onSettings: [];
}>();

const { isAuthenticated } = useAuth();

const items = ref<DropdownMenuItem[]>([]);

onMounted(() => {
  if (isAuthenticated.value) {
    items.value.push(
      /* WORK IN PROGRESS */

      // {
      //   label: "My Account",
      //   icon: "lucide:user",
      //   value: "item1",
      //   onSelect: () => {
      //     emit("onMyAccount");
      //   },
      // },
      // {
      //   label: "Settings",
      //   icon: "lucide:settings",
      //   value: "item2",
      //   onSelect: () => {
      //     emit("onSettings");
      //   },
      // },
      // {
      //   type: "separator",
      // },
      {
        label: "Logout",
        icon: "lucide:log-out",
        value: "item3",
        onSelect: () => {
          emit("onLogout");
        },
      }
    );
  } else {
    items.value.push({
      label: "Login",
      icon: "lucide:log-in",
      onSelect: () => {
        emit("onLogin");
      },
    });
  }
});
</script>

<style scoped lang=""></style>
