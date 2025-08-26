<template>
  <MainWrapper>
    <template #sub-header v-if="isAdmin">
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
    </template>

    <MainContent>
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
                    :hasError="hasError.pseudo"
                    @input="validatePseudo(form.pseudo)"
                    :disabled="isMainActionLoading"
                  />
                </Transition>

                <FormField
                  name="email"
                  type="email"
                  placeholder="Email"
                  size="sm"
                  label="Email"
                  v-model="form.email"
                  :hasError="hasError.email"
                  @input="
                    validateEmail(
                      form.email,
                      showRegister ? 'register' : 'login'
                    )
                  "
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
                      :hasError="hasError.password"
                      @input="
                        validatePassword(
                          form.password,
                          showRegister ? 'register' : 'login'
                        )
                      "
                      :disabled="isMainActionLoading"
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

                  <FormField
                    v-if="showRegister"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    size="sm"
                    label="Confirm Password"
                    v-model="form.confirmPassword"
                    :hasError="hasError.confirmPassword"
                    @input="confirmPasswords"
                    :disabled="isMainActionLoading"
                  />
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
import { ref, watch, Transition, computed } from "vue";
import { ButtonUI } from "@/components/ui";
import { normalize, verifyEmail, verifyPseudo, hasProfanity } from "@/utils";
import { throwFrontError, isFrontError } from "@/utils/error";
import { Logger } from "@/composables/useLogger";
import { usePresetToast } from "@/composables/toast";

const { isAdmin, currentUser } = useUser();
const { logout, isAuthenticated, login, register } = useAuth();
const { navigateTo } = useNavigation();
const { toastSuccess, toastError } = usePresetToast();

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
    form.value.email = "";
    form.value.password = "";
    form.value.pseudo = "";

    resetForm();

    emailErrors.value = "";
    passwordErrors.value = "";
    pseudoErrors.value = "";
  }
});

const errorFields = ["pseudo", "email", "password", "confirmPassword"] as const;
type ErrorField = (typeof errorFields)[number];
type ErrorType =
  | "invalid"
  | "profanity"
  | "length"
  | "uppercase"
  | "required"
  | "special"
  | "number"
  | "mismatch";
type FormError = {
  field: ErrorField;
  type: ErrorType;
  message: string;
};

const errors = ref<FormError[]>([]);

const sortedErrors = computed(() => {
  return errors.value
    .sort((a, b) => {
      const fieldSorting =
        errorFields.indexOf(a.field) - errorFields.indexOf(b.field);
      if (fieldSorting) return fieldSorting;

      // Sort by message length: longest first
      return b.message.length - a.message.length;
    })
    .slice(0, 2);
});

const hasError = ref({
  email: false,
  password: false,
  pseudo: false,
  confirmPassword: false,
});

const pseudoErrors = ref();
const emailErrors = ref();
const passwordErrors = ref();

const form = ref({
  email: "",
  password: "",
  pseudo: "",
  confirmPassword: "",
});

const resetForm = () => {
  form.value.email = "";
  form.value.password = "";
  form.value.pseudo = "";
  form.value.confirmPassword = "";

  hasError.value.email = false;
  hasError.value.password = false;
  hasError.value.pseudo = false;
  errors.value = [];
};
watch(showRegister, resetForm);

const hasAnyError = computed(() => {
  return Object.values(hasError.value).some((error) => error);
});

// onMounted(async () => {
//   if (!isAuthenticated.value) {
//     await initializeAuth();
//     if (currentUser.value) {
//       toastInfo({
//         description: `Welcome back ${currentUser.value.pseudo} !`,
//       });
//     }
//   }
// });

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

const clearErrorText = (field: ErrorField, type: ErrorType) => {
  errors.value = errors.value.filter(
    (error) => error.field !== field || error.type !== type
  );
};

const validatePassword = (
  password: string,
  context: "login" | "loginAction" | "register"
): boolean => {
  hasError.value.password = false;

  clearErrorText("password", "required");
  if (!password) {
    hasError.value.password = true;
    errors.value.push({
      field: "password",
      type: "required",
      message: "Password is required",
    });
    return false;
  }

  if (context === "register" || context === "loginAction") {
    clearErrorText("password", "length");
    if (password.length < 8 || password.length > 32) {
      hasError.value.password = true;
      errors.value.push({
        field: "password",
        type: "length",
        message: "Password must be 8-32 chars long",
      });
    }
  }

  if (context === "register") {
    clearErrorText("password", "uppercase");
    if (!/[A-Z]/.test(password)) {
      hasError.value.password = true;
      errors.value.push({
        field: "password",
        type: "uppercase",
        message: "Password requires at least 1 uppercase",
      });
    }

    clearErrorText("password", "special");
    if (!/[^A-Za-z0-9\s]/.test(password)) {
      hasError.value.password = true;
      errors.value.push({
        field: "password",
        type: "special",
        message: "Password must have 1 special character",
      });
    }

    clearErrorText("password", "number");
    if (!/[0-9]/.test(password)) {
      hasError.value.password = true;
      errors.value.push({
        field: "password",
        type: "number",
        message: "Password requires at least 1 number",
      });
    }
  }

  if (hasError.value.password) return false;

  return true;
};

const confirmPasswords = () => {
  hasError.value.confirmPassword = false;

  clearErrorText("confirmPassword", "mismatch");
  if (form.value.password !== form.value.confirmPassword) {
    hasError.value.confirmPassword = true;
    errors.value.push({
      field: "confirmPassword",
      type: "mismatch",
      message: "Passwords do not match",
    });
  }
};

const validateEmail = (email: string, context?: "login" | "register") => {
  if (context === "login") return;

  hasError.value.email = false;

  try {
    clearErrorText("email", "required");
    if (!email) {
      hasError.value.email = true;
      errors.value.push({
        field: "email",
        type: "required",
        message: "Email is required",
      });
      return;
    }

    clearErrorText("email", "invalid");
    if (!verifyEmail(email)) {
      hasError.value.email = true;
      errors.value.push({
        field: "email",
        type: "invalid",
        message: "Invalid email format",
      });
    }
  } catch (error) {
    throwFrontError("Error validating email", { email, error });
  }
};

const validatePseudo = (pseudo: string) => {
  try {
    hasError.value.pseudo = false;

    clearErrorText("pseudo", "required");
    if (!pseudo) {
      hasError.value.pseudo = true;
      errors.value.push({
        field: "pseudo",
        type: "required",
        message: "Pseudo is required",
      });
      return;
    }

    clearErrorText("pseudo", "invalid");
    if (!verifyPseudo(pseudo)) {
      hasError.value.pseudo = true;
      errors.value.push({
        field: "pseudo",
        type: "invalid",
        message: "Invalid pseudo",
      });
    }

    clearErrorText("pseudo", "profanity");
    if (hasProfanity(pseudo)) {
      hasError.value.pseudo = true;
      errors.value.push({
        field: "pseudo",
        type: "profanity",
        message: "Pseudo contains profanity",
      });
    }

    clearErrorText("pseudo", "length");
    if (pseudo.length < 3 || pseudo.length > 16) {
      hasError.value.pseudo = true;
      errors.value.push({
        field: "pseudo",
        type: "length",
        message: "Pseudo must be 3-16 chars long",
      });
    }
  } catch (error) {
    throwFrontError("Error validating pseudo", { pseudo, error });
  }
};

const loginFlow = async () => {
  isMainActionLoading.value = true;

  const email = normalize(form.value.email);
  const password = form.value.password.trim();

  try {
    validateEmail(email);
    validatePassword(password, "loginAction");

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
    validatePassword(password, "register");
    confirmPasswords();

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
    await logout();
  } catch (error) {
    Logger.error(error);
  } finally {
    isLogoutLoading.value = false;
  }
};
</script>

<style scoped lang=""></style>
