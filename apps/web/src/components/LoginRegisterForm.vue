<template>
  <form :class="ui.formWrapper">
    <div :class="ui.formContent">
      <Transition
        enter-active-class="transition-all duration-600 ease-out"
        enter-from-class="opacity-0 transform translate-y-3 translate-x-2 scale-95"
        enter-to-class="opacity-100 transform translate-y-0 scale-100"
      >
        <FormField
          v-if="modeRegister"
          name="pseudo"
          type="text"
          placeholder="Pseudo"
          :size="inputSize"
          label="Pseudo"
          v-model="form.pseudo"
          :hasError="fieldsError.pseudo"
          @input="validatePseudo(form.pseudo)"
          :disabled="isFormLocked"
          required
          :horizontal="isHorizontal"
        />
      </Transition>

      <FormField
        name="email"
        type="email"
        placeholder="Email"
        :size="inputSize"
        label="Email"
        v-model="form.email"
        :hasError="fieldsError.email"
        :required="modeRegister"
        @input="validateEmailInput"
        :disabled="isFormLocked"
        :horizontal="isHorizontal"
      />

      <div class="flex flex-col gap-2 sm:gap-3 w-full max-sm:items-center">
        <div>
          <FormField
            name="password"
            type="password"
            placeholder="Password"
            :size="inputSize"
            label="Password"
            v-model="form.password"
            :hasError="fieldsError.password"
            @input="validatePasswordInput"
            :disabled="isFormLocked"
            :required="modeRegister"
            :horizontal="isHorizontal"
          />
          <Transition
            :appear="true"
            enter-active-class="transition-all duration-1500 ease-out"
            enter-from-class="opacity-25 transform -translate-y-4 scale-90"
            enter-to-class="opacity-100 transform translate-y-0 scale-100"
          >
            <div
              v-if="!modeRegister"
              role="link"
              :class="[ui.forgotPasswordClass]"
              @click="
                console.warn('Forgotten password flow not yet implemented')
              "
            >
              Forgot password?
            </div>
          </Transition>
        </div>

        <Transition
          enter-active-class="transition-all duration-600 ease-out"
          enter-from-class="opacity-50 transform -translate-y-3 translate-x-2 scale-95"
          enter-to-class="opacity-100 transform translate-y-0 scale-100"
        >
          <div v-if="modeRegister">
            <FormField
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              :size="inputSize"
              label="Confirm Password"
              v-model="form.confirmPassword"
              :hasError="fieldsError.confirmPassword"
              @input="confirmPasswords"
              :disabled="isFormLocked"
              :horizontal="isHorizontal"
              required
            />
            <div :class="[ui.fontSize, 'text-lTheme-font']">
              <span class="text-lTheme-danger">*</span>Required
            </div>
          </div>
        </Transition>
      </div>

      <div
        v-if="!modeRegister"
        role="link"
        :class="[ui.fontSize, ui.linkClass]"
        @click="modeRegister = true"
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
        :class="ui.errorTextClass"
        >{{ error.message }}</span
      >

      <span
        v-if="errors.length > 2"
        style="opacity: 40%"
        :class="ui.errorTextClass"
      >
        {{ `+${errors.length - 1} more` }}</span
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "@/composables";
import { throwFrontError } from "@/utils/error";
import { normalize } from "@/utils";
import { watch, computed } from "vue";
import { useWindowSize } from "@vueuse/core";

const props = defineProps<{
  isFormLocked: boolean;
}>();

const form = defineModel<{
  email: string;
  password: string;
  pseudo: string;
  confirmPassword: string;
}>("form", { required: true });

const {
  validatePseudo,
  validateEmail,
  validatePassword,
  confirmPasswords,
  sortedErrors,
  errors,
  resetErrors,
  hasAnyError,
  fieldsError,
} = useForm();
const { width } = useWindowSize();

const modeRegister = defineModel<boolean>("modeRegister", { required: true });

const ui = computed(() => ({
  wrapper: "flex flex-col gap-2",
  formWrapper: [
    "flex flex-col absolute z-1 items-center rounded-sm",
    "w-45 sm:w-90",
  ],
  formContent: [
    "flex flex-col w-full p-2 sm:p-3 gap-2 sm:gap-4 items-center",
    " bg-dTheme-light rounded-sm",
    // modeRegister.value ? "sm:h-80 h-70" : "sm:h-45 h-50",
  ],
  fontSize: "text-[8px] sm:text-[10px]",
  linkClass:
    "text-lTheme-font place-self-center hover:underline hover:cursor-pointer",
  errorTextClass: "text-lTheme-danger text-[9px] text-center",
  forgotPasswordClass: [
    "text-[8px] sm:text-[10px]",
    "text-lTheme-font place-self-center",
    "hover:underline hover:cursor-pointer",
    "sm:place-self-start place-self-center",
  ],
}));

const hasError = defineModel<boolean>("hasError", {
  default: false,
});

watch(
  hasAnyError,
  () => {
    hasError.value = hasAnyError.value;
  },
  { immediate: true }
);

watch(modeRegister, () => {
  resetErrors();
});

const isHorizontal = computed(() => width.value > 640);
const inputSize = computed(() => (width.value > 640 ? "md" : "sm"));

/**
 * Handles the password input
 *
 * Register mode:
 * - `true` -> All validation checks
 * - `false` -> Only `required` validation check
 */
const validatePasswordInput = () => {
  try {
    if (modeRegister.value) {
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

/**
 * Handles the email input
 *
 * Register mode:
 * - `true` -> All validation checks
 * - `false` -> Only `required` validation check
 */
const validateEmailInput = () => {
  form.value.email = normalize(form.value.email);

  try {
    if (modeRegister.value) {
      validateEmail(form.value.email);
    } else {
      validateEmail(form.value.email, {
        required: true,
      });
    }
  } catch (error) {
    throwFrontError("Error validating email", {
      email: form.value.email,
      error,
    });
  }
};
</script>

<style scoped lang=""></style>
