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
            :class="verticalAnimation.join(' ')"
          >
            <ButtonUI
              v-if="isFormAppearing"
              size="sm"
              class="z--1 absolute transition-transform transition-ease"
              :class="lateralLeftAnimation.join(' ')"
              @click="secondaryActions"
            >
              {{ showRegister ? "<<<" : "Cancel" }}
            </ButtonUI>

            <ButtonUI
              v-if="!showRegister"
              class="transition-transform transition-ease"
              :class="lateralRightAnimation.join(' ')"
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
              :class="lateralRightAnimation.join(' ')"
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
            <form v-if="isFormAppearing" :class="ui.formWrapper">
              <div :class="ui.formContent">
                <Transition
                  enter-active-class="transition-all translate-y--5 duration-300 ease-in-out"
                  enter-from-class="opacity-50 transform scale-95"
                  enter-to-class="opacity-100 transform translate-y-0 scale-100"
                >
                  <FormField
                    v-if="showRegister"
                    name="pseudo"
                    type="text"
                    placeholder="Pseudo"
                    size="sm"
                    label="Pseudo"
                    v-model="form.pseudo"
                    :hasError="fieldsError.pseudo"
                    @input="validatePseudo(form.pseudo)"
                    :disabled="isMainActionLoading"
                    required
                  />
                </Transition>

                <FormField
                  name="email"
                  type="email"
                  placeholder="Email"
                  size="sm"
                  label="Email"
                  v-model="form.email"
                  :hasError="fieldsError.email"
                  v-bind="{ required: showRegister }"
                  @input="handleEmailInput"
                  :disabled="isMainActionLoading"
                />

                <div class="flex flex-col gap-2">
                  <div>
                    <FormField
                      name="password"
                      type="password"
                      placeholder="Password"
                      size="sm"
                      label="Password"
                      v-model="form.password"
                      :hasError="fieldsError.password"
                      @input="handlePasswordInput"
                      :disabled="isMainActionLoading"
                      v-bind="{ required: showRegister }"
                    />
                    <div
                      v-if="!showRegister"
                      role="link"
                      class="text-[8px] text-lTheme-font place-self-center hover:underline hover:cursor-pointer"
                      @click="
                        console.warn(
                          'Forgotten password flow not yet implemented'
                        )
                      "
                    >
                      Forgot password?
                    </div>
                  </div>

                  <div>
                    <FormField
                      v-if="showRegister"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      size="sm"
                      label="Confirm Password"
                      v-model="form.confirmPassword"
                      :hasError="fieldsError.confirmPassword"
                      @input="
                        confirmPasswords(form.password, form.confirmPassword)
                      "
                      :disabled="isMainActionLoading"
                      required
                    />
                    <div
                      v-if="showRegister"
                      class="text-[8px] text-lTheme-font"
                    >
                      <span class="text-lTheme-danger">*</span>Required
                    </div>
                  </div>
                </div>

                <div
                  v-if="!showRegister"
                  role="link"
                  class="text-[8px] text-lTheme-font place-self-center hover:underline hover:cursor-pointer"
                  @click="showRegister = true"
                >
                  Don't have an account? Register
                </div>
              </div>

              <!-- ERRORS -->
              <div class="flex flex-col">
                <span
                  v-for="(error, index) in sortedErrors"
                  :key="error.field + error.type"
                  :style="{ opacity: (100 - 30 * index) / 100 }"
                  class="text-lTheme-danger text-[9px] text-center"
                  >{{ error.message }}</span
                >

                <span
                  v-if="errors.length > 2"
                  style="opacity: 40%"
                  class="text-lTheme-danger text-[9px] text-center"
                >
                  {{ `+${errors.length - 1} more` }}</span
                >
              </div>
            </form>
          </Transition>
        </div>
      </div>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { FormField, MainContent, MainWrapper } from "@/components";
import { useAuth, useNavigation, useUser } from "@/composables";
import { ref, watch, Transition } from "vue";
import { ButtonUI } from "@/components/ui";
import { normalize } from "@/utils";
import { throwFrontError, isFrontError } from "@/utils/error";
import { Logger } from "@/composables/useLogger";
import { usePresetToast } from "@/composables/toast";
import { useForm } from "@/composables/";

const { isAdmin, currentUser } = useUser();
const { logout, isAuthenticated, login, register } = useAuth();
const { navigateTo } = useNavigation();
const { toastSuccess, toastError, toastInfo } = usePresetToast();
const {
  validatePseudo,
  validateEmail,
  validatePassword,
  confirmPasswords,
  sortedErrors,
  errors,
  resetErrors,
  fieldsError,
  hasAnyError,
} = useForm();

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

// Handles animations
watch(showForm, () => {
  if (showForm.value) {
    verticalAnimation.value.push("translate-y-58");

    isFormAppearing.value = true;
    setTimeout(() => {
      lateralRightAnimation.value.push("translate-x-20");
      lateralLeftAnimation.value.push("translate-x--20");

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
    resetForm();
  }
});

const form = ref({
  email: "",
  password: "",
  pseudo: "",
  confirmPassword: "",
});

const resetForm = () => {
  form.value = {
    email: "",
    password: "",
    pseudo: "",
    confirmPassword: "",
  };

  resetErrors();
};
watch(showRegister, resetForm);

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

const handlePasswordInput = () => {
  try {
    if (showRegister.value) {
      validatePassword(form.value.password);
    } else {
      validatePassword(form.value.password, {
        required: true,
      });
    }
  } catch (error) {
    throwFrontError("Error validating password", {
      password: form.value.password,
      error,
    });
  }
};

const handleEmailInput = () => {
  try {
    if (showRegister.value) {
      validateEmail(form.value.email);
    }
  } catch (error) {
    throwFrontError("Error validating email", {
      email: form.value.email,
      error,
    });
  }
};

const loginFlow = async () => {
  isMainActionLoading.value = true;

  const email = normalize(form.value.email);
  const password = form.value.password.trim();

  try {
    validateEmail(email);
    validatePassword(password, {
      required: true,
    });

    if (hasAnyError.value) {
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
    validatePseudo(pseudo);
    validateEmail(email);
    validatePassword(password);
    confirmPasswords(form.value.password, form.value.confirmPassword);

    if (hasAnyError.value) {
      return;
    }

    const success = await register({ email, password, pseudo });
    if (success) {
      toastSuccess({ description: "Register successful" });
      navigateTo("/play/");
    }
  } catch (error) {
    Logger.error(error);
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
