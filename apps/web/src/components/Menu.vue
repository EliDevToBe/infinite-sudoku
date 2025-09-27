<template>
  <div :class="ui.wrapper">
    <DropDownUI v-model="items" :offset="10" side="bottom" align="center">
      <ButtonUI
        size="icon"
        iconSize="25"
        :class="ui.button"
        variant="ghost"
        :leadingIcon="isAuthenticated ? 'lucide:user' : 'lucide:menu'"
      >
      </ButtonUI>
    </DropDownUI>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DropDownUI } from "@/components/ui";
import type { DropdownMenuItem } from "@nuxt/ui";
import { useUser, useAuth, useNavigation } from "@/composables";
import { isFrontError, throwFrontError } from "@/utils/error";
import { usePresetToast } from "@/composables/toast";

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
  button: "text-dTheme-font sm:w-10! sm:h-10! w-8! h-8! border-none",
};

const emit = defineEmits<{
  onLogin: [];
}>();

const { isAdmin } = useUser();
const { isAuthenticated } = useAuth();
const { navigateTo } = useNavigation();
const { toastError, toastInfo } = usePresetToast();
const { logout } = useAuth();
const { currentUser } = useUser();

const items = computed<DropdownMenuItem[]>(() => {
  const list: DropdownMenuItem[] = [];

  if (isAuthenticated.value) {
    if (isAdmin.value) {
      list.push(
        {
          label: "Design",
          icon: "lucide:palette",
          onSelect: () => {
            return navigateTo("/design/");
          },
        },
        {
          type: "separator",
        }
      );
    }

    list.push(
      /* WORK IN PROGRESS */

      // {
      //   label: "My Account",
      //   icon: "lucide:user",
      //   onSelect: () => {
      //     emit("onMyAccount");
      //   },
      // },
      // {
      //   label: "Settings",
      //   icon: "lucide:settings",
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
        onSelect: () => {
          return logoutFlow();
        },
      }
    );
  } else {
    list.push({
      label: "Login",
      icon: "lucide:log-in",
      onSelect: () => {
        emit("onLogin");
      },
    });
  }

  return list;
});

const logoutFlow = async () => {
  try {
    const success = await logout();
    if (!success) {
      throwFrontError("Failed to logout", {
        user: currentUser.value?.id,
      });
      return;
    }

    toastInfo({
      title: "Logout successful",
      description: "See you soon !",
    });
  } catch (error) {
    if (isFrontError(error)) {
      toastError(error, { description: error.message });
    } else {
      toastError(error, { description: "An error occurred" });
    }
  }
};
</script>

<style scoped lang=""></style>
