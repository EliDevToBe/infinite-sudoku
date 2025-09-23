<template>
  <MainWrapper>
    <template #sub-header v-if="isAdmin">
      <div class="flex items-center justify-center">
        <ButtonUI
          size="sm"
          @click="
            () => {
              navigateTo('/design/');
            }
          "
        >
          DESIGN
        </ButtonUI>
      </div>
    </template>

    <MainContent class="justify-center">
      <div :class="ui.menuWrapper">
        <ButtonUI size="lg" @click="navigateTo('/play/')">PLAY</ButtonUI>

        <!-- REGISTER / LOGIN -->
        <div class="flex flex-col items-center isolate">
          <div
            v-if="!isAuthenticated"
            class="relative flex items-center justify-center transition-ease z-2"
            :class="verticalAnimation"
          >
            <ButtonUI
              v-if="isFormAppearing"
              size="sm"
              class="z--1 absolute transition-transform transition-ease"
              :class="lateralLeftAnimation"
              @click="secondaryActions"
            >
              {{ showRegister ? "<<<" : "Cancel" }}
            </ButtonUI>

            <ButtonUI
              v-if="!showRegister"
              class="transition-transform transition-ease"
              :class="lateralRightAnimation"
              size="md"
              @click="mainActions"
              :isLoading="isMainActionLoading"
              :disabled="isMainActionLoading"
            >
              Login
            </ButtonUI>

            <ButtonUI
              v-if="showRegister"
              class="transition-transform transition-ease"
              :class="lateralRightAnimation"
              size="md"
              @click="mainActions"
              :isLoading="isMainActionLoading"
              :disabled="isMainActionLoading"
            >
              Register
            </ButtonUI>
          </div>

          <ButtonUI v-else @click="logoutFlow" :isLoading="isLogoutLoading">
            Logout
          </ButtonUI>

          <!-- FORM -->
          <Transition
            enter-active-class="transition-all duration-800 ease-out"
            enter-from-class="opacity-0 transform -translate-y-2 scale-95"
            enter-to-class="opacity-100 transform translate-y-0 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 transform translate-y-0 scale-100"
            leave-to-class="opacity-0 transform -translate-y-2 scale-95"
          >
            <LoginRegisterForm
              class="absolute"
              ref="LoginRegisterFormRef"
              v-if="showForm"
              v-model:form="form"
              v-model:modeRegister="showRegister"
              :isFormLocked="isMainActionLoading"
              v-model:hasError="hasError"
            />
          </Transition>
        </div>
      </div>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { MainContent, MainWrapper } from "@/components";
import { useAuth, useNavigation, useUser } from "@/composables";
import { ref, watch, Transition, useTemplateRef } from "vue";
import { ButtonUI } from "@/components/ui";
import { normalize } from "@/utils";
import { isFrontError } from "@/utils/error";
import { usePresetToast } from "@/composables/toast";
import LoginRegisterForm from "@/components/LoginRegisterForm.vue";

const { isAdmin, currentUser } = useUser();
const { logout, isAuthenticated, login, register } = useAuth();
const { navigateTo } = useNavigation();
const { toastSuccess, toastError, toastInfo } = usePresetToast();

const ui = {
  title: "text-3xl font-bold mb-8",
  menuWrapper: "flex flex-col gap-2 items-center w-75 h-75",
  formWrapper: `flex flex-col w-45 items-center absolute z-1 rounded-sm`,
  formContent: `flex flex-col w-full p-2 gap-2 items-center bg-dTheme-light rounded-sm`,
};

const verticalAnimation = ref<string[]>(["duration-500"]);
const lateralRightAnimation = ref<string[]>(["duration-400"]);
const lateralLeftAnimation = ref<string[]>(["duration-400"]);

const showForm = ref(false);
const showRegister = ref(false);
const isFormAppearing = ref(false);
const isMenuOpen = ref(false);

const isMainActionLoading = ref(false);
const isLogoutLoading = ref(false);

const hasError = ref(false);
const loginRegisterFormRef = useTemplateRef<
  InstanceType<typeof LoginRegisterForm>
>("LoginRegisterFormRef");

// Handles animations
watch(showForm, () => {
  if (showForm.value) {
    verticalAnimation.value.push("max-sm:translate-y-61 translate-y-70");

    isFormAppearing.value = true;
    setTimeout(() => {
      lateralRightAnimation.value.push("translate-x-31 max-sm:translate-x-12");
      lateralLeftAnimation.value.push("translate-x--33 max-sm:translate-x--15");

      setTimeout(() => {
        isMenuOpen.value = true;
      }, 400);
    }, 500);
  } else {
    lateralRightAnimation.value.pop();
    lateralLeftAnimation.value.pop();

    setTimeout(() => {
      verticalAnimation.value.pop();

      isFormAppearing.value = false;

      setTimeout(() => {
        isMenuOpen.value = false;
        showRegister.value = false;
      }, 500);
    }, 400);
  }
});

// When menu is closed, reset state
watch(isMenuOpen, () => {
  if (!isMenuOpen.value) {
    form.value = {
      email: "",
      password: "",
      pseudo: "",
      confirmPassword: "",
    };
  }
});

const form = ref({
  email: "",
  password: "",
  pseudo: "",
  confirmPassword: "",
});

const mainActions = async () => {
  if (!isMenuOpen.value) {
    showForm.value = !showForm.value;
    return;
  }

  if (showRegister.value) {
    await registerFlow();
  } else if (!showRegister.value) {
    await loginFlow();
  }
};

const secondaryActions = () => {
  if (!showRegister.value) {
    showForm.value = false;
    return;
  }

  if (showRegister.value) {
    showRegister.value = false;
    return;
  }
};

const loginFlow = async () => {
  isMainActionLoading.value = true;

  const email = normalize(form.value.email);
  const password = form.value.password.trim();

  try {
    loginRegisterFormRef.value?.validateForm();

    if (hasError.value) {
      return;
    }

    const success = await login(email, password);
    if (success) {
      toastSuccess({
        title: "Login successful",
        description: `Welcome ${currentUser.value?.pseudo} !`,
      });
      navigateTo("/play/");
    }
  } catch (error) {
    if (isFrontError(error)) {
      toastError(error, { description: error.message });
    } else {
      toastError(error, { description: "An error occurred" });
    }
  } finally {
    isMainActionLoading.value = false;
  }
};

const registerFlow = async () => {
  isMainActionLoading.value = true;

  const email = normalize(form.value.email);
  const password = form.value.password.trim();
  const pseudo = form.value.pseudo.trim();

  try {
    loginRegisterFormRef.value?.validateForm();

    if (hasError.value) {
      return;
    }

    const success = await register({ email, password, pseudo });
    if (success) {
      toastSuccess({ description: "Register successful" });
      navigateTo("/play/");
    }
  } catch (error) {
    if (isFrontError(error)) {
      toastError(error, { description: error.message });
    } else {
      toastError(error, { description: "An error occurred" });
    }
  } finally {
    isMainActionLoading.value = false;
  }
};

const logoutFlow = async () => {
  isLogoutLoading.value = true;
  try {
    const success = await logout();
    if (success) {
      toastInfo({
        title: "Logout successful",
        description: "See you soon !",
      });
    }
  } catch (error) {
    if (isFrontError(error)) {
      toastError(error, { description: error.message });
    } else {
      toastError(error, { description: "An error occurred" });
    }
  } finally {
    isLogoutLoading.value = false;
  }
};
</script>

<style scoped lang=""></style>
