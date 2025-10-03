<template>
  <div class="flex flex-col items-center justify-center h-full">
    <div>
      <form
        class="flex flex-col justify-center items-center gap-10 w-fit sm:w-100"
      >
        <div class="h-40">
          <div :class="ui.formContent">
            <FormField
              label="New Password"
              name="password"
              type="password"
              size="md"
              placeholder="New Password"
              v-model="passwordForm.password"
              :horizontal="isHorizontal"
              required
              :disabled="isLoading"
              @input="
                validatePassword(passwordForm.password);
                confirmPasswords(
                  passwordForm.password,
                  passwordForm.confirmPassword
                );
              "
              :has-error="fieldsError.password"
            />
            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              size="md"
              placeholder="Confirm Password"
              v-model="passwordForm.confirmPassword"
              :horizontal="isHorizontal"
              required
              :disabled="isLoading"
              @input="
                confirmPasswords(
                  passwordForm.password,
                  passwordForm.confirmPassword
                )
              "
              :has-error="fieldsError.confirmPassword"
            />
          </div>
          <FormErrorText :sorted-errors="sortedErrors" :errors="errors" />
        </div>

        <ButtonUI
          :disabled="isLoading"
          :is-loading="isLoading"
          @click.prevent="changePassword"
          >Change password</ButtonUI
        >
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import {
  useForm,
  useAuth,
  usePresetToast,
  useNavigation,
  useEmail,
} from "@/composables";
import { isFrontError } from "@/utils/error";

const route = useRoute();
const { width } = useWindowSize();
const {
  validatePassword,
  confirmPasswords,
  hasAnyError,
  sortedErrors,
  errors,
  fieldsError,
} = useForm();
const { resetPassword, login } = useAuth();
const { toastSuccess, toastError, toastAction } = usePresetToast();
const { sendConfirmationEmail } = useEmail();
const { navigateTo } = useNavigation();

const ui = {
  formContent: [
    "flex flex-col w-full p-2 sm:p-3 gap-2 sm:gap-4 items-center",
    " bg-dTheme-light rounded-xl",
  ],
};

const token = route.query.t as string;

const passwordForm = ref({
  password: "",
  confirmPassword: "",
});

const isLoading = ref(false);
const isHorizontal = computed(() => width.value > 640);

const changePassword = async (e: Event) => {
  const password = passwordForm.value.password.trim();
  const confirmPassword = passwordForm.value.confirmPassword.trim();

  validatePassword(password);
  confirmPasswords(password, confirmPassword);

  if (hasAnyError.value) {
    return;
  }

  isLoading.value = true;

  try {
    const success = await resetPassword({
      password,
      token,
    });

    if (!success) {
      return;
    }

    if (success.clientMessage === "You must have a confirmed email") {
      toastAction({
        title: "You must have a confirmed email",
        actions: [
          {
            leadingIcon: "i-lucide-refresh-cw",
            label: "Resend confirmation email",
            onClick: async () => {
              const email = await sendConfirmationEmail(success.email);
              if (email) {
                toastSuccess({
                  description: "Confirmation email sent",
                });
              }
            },
          },
        ],
      });
      return;
    }

    toastSuccess({
      description: "Your password has been reset successfully",
    });

    await login(success.email, password);

    navigateTo("/");
  } catch (error) {
    if (isFrontError(error)) {
      toastError(error, { description: error.message });
    } else {
      toastError(error, { description: "An error occurred" });
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang=""></style>
