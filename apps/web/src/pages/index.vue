<template>
  <MainWrapper>
    <div :class="ui.content">
      <div :class="ui.menuWrapper">
        <ButtonUI size="lg" @click="navigateTo('/play/')">PLAY</ButtonUI>

        <!-- REGISTER / LOGIN -->
        <div class="flex flex-col items-center isolate">
          <div
            v-if="!isAuthenticated"
            class="relative flex items-center justify-center transition-ease"
            :class="verticalAnimation.join(' ')"
          >
            <ButtonUI
              v-if="isFormAppearing"
              size="sm"
              class="z--1 absolute transition-transform transition-ease"
              :class="lateralLeftAnimation.join(' ')"
              @click="showForm = false"
            >
              Cancel
            </ButtonUI>

            <ButtonUI
              v-if="!showRegister"
              class="transition-transform transition-ease"
              :class="lateralRightAnimation.join(' ')"
              size="md"
              @click="toggleButtonActions"
            >
              Login
            </ButtonUI>

            <ButtonUI
              v-if="showRegister"
              class="transition-transform transition-ease"
              :class="lateralRightAnimation.join(' ')"
              size="md"
              @click="toggleButtonActions"
            >
              Register
            </ButtonUI>
          </div>

          <ButtonUI v-else @click="logout"> Logout </ButtonUI>

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
                    @input="hasError.pseudo = false"
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
                  @input="hasError.email = false"
                />

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

                <div
                  v-if="!showRegister"
                  role="link"
                  class="text-[8px] text-lTheme-font place-self-center hover:underline hover:cursor-pointer"
                  @click="showRegister = true"
                >
                  Don't have an account? Register
                </div>
              </div>
              <span
                v-if="hasError.email"
                class="text-lTheme-danger text-[9px] text-center"
                >{{ emailErrors }}</span
              >
              <span
                v-if="hasError.password"
                class="text-lTheme-danger text-[9px] text-center"
                >{{ passwordErrors }}</span
              >
              <span
                v-if="hasError.pseudo"
                class="text-lTheme-danger text-[9px] text-center"
                >{{ pseudoErrors }}</span
              >
            </form>
          </Transition>
        </div>

        <ButtonUI
          size="sm"
          v-if="isAuthenticated"
          @click="
            () => {
              console.log('CLICKED');
              navigateTo('/design/');
            }
          "
        >
          DESIGN
        </ButtonUI>
      </div>
    </div>
  </MainWrapper>
</template>

<script setup lang="ts">
import { FormField, MainWrapper } from "@/components";
import { useAuth, useNavigation } from "@/composables";
import { onMounted, ref, watch, Transition, computed } from "vue";
import { ButtonUI } from "@/components/ui";
import { normalize, verifyEmail, hasProfanity } from "@/utils";
import { throwFrontError } from "@/utils/error";
import { Logger } from "@/composables/useLogger";

const { logout, isAuthenticated, initializeAuth, login } = useAuth();
const { navigateTo } = useNavigation();

const ui = {
  content: "flex justify-center items-center h-full",
  title: "text-3xl font-bold mb-8",
  menuWrapper: "flex flex-col gap-2 items-center w-75 h-75",
  formWrapper: `flex flex-col w-45 items-center absolute z-1 rounded-sm`,
  formContent: `flex flex-col w-full p-2 gap-2 items-center bg-dTheme-light rounded-sm`,
};

const showForm = ref(false);
const showRegister = ref(false);
const isFormAppearing = ref(false);

const isMenuOpen = ref(false);

const verticalAnimation = ref<string[]>(["duration-500"]);
const lateralRightAnimation = ref<string[]>(["duration-400"]);
const lateralLeftAnimation = ref<string[]>(["duration-400"]);

watch(showForm, () => {
  if (showForm.value) {
    verticalAnimation.value.push("translate-y-44");

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

watch(isMenuOpen, () => {
  // When menu is closed, reset state
  if (!isMenuOpen.value) {
    form.value.email = "";
    form.value.password = "";
    form.value.pseudo = "";

    hasError.value.email = false;
    hasError.value.password = false;
    hasError.value.pseudo = false;

    emailErrors.value = "";
    passwordErrors.value = "";
    pseudoErrors.value = "";
  }
});

const form = ref({
  email: "",
  password: "",
  pseudo: "",
});

const hasAnyError = computed(() => {
  return Object.values(hasError.value).some((error) => error);
});

const hasError = ref({
  email: false,
  password: false,
  pseudo: false,
});

const pseudoErrors = ref();
const emailErrors = ref();
const passwordErrors = ref();

onMounted(async () => {
  if (!isAuthenticated.value) {
    await initializeAuth();
  }
});

const toggleButtonActions = async () => {
  if (!isMenuOpen.value) {
    showForm.value = !showForm.value;
    return;
  }

  if (showRegister.value) {
    console.log("REGISTER FLOW");
  } else {
    await loginFlow();
  }
};

const validatePassword = (
  password: string,
  context: "login" | "loginAction" | "register"
) => {
  hasError.value.password = false;

  if (!password) {
    hasError.value.password = true;
    passwordErrors.value = "Password is required";
    return false;
  }

  if (context === "register" || context === "loginAction") {
    if (password.length < 8 || password.length > 32) {
      hasError.value.password = true;
      passwordErrors.value = "Password must be 8-32 chars long";
      return false;
    }
  }

  if (context === "register") {
    if (!/[A-Z]/.test(password)) {
      hasError.value.password = true;
      passwordErrors.value = "Password requires at least 1 uppercase";
      return false;
    }
  }

  return true;
};

const loginFlow = async () => {
  const email = normalize(form.value.email);
  const password = form.value.password.trim();

  try {
    if (!email || !verifyEmail(email)) {
      hasError.value.email = true;
      emailErrors.value = "Invalid email format";
    }

    validatePassword(password, "loginAction");

    if (hasAnyError.value) {
      return;
    }

    await login(email, password);
  } catch (error) {
    Logger.error(error);
  }
};
</script>

<style scoped lang=""></style>
