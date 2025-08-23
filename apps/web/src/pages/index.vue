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
                  />
                </Transition>

                <FormField
                  name="email"
                  type="email"
                  placeholder="Email"
                  size="sm"
                  label="Email"
                  v-model="form.email"
                />

                <div>
                  <FormField
                    name="password"
                    type="password"
                    placeholder="Password"
                    size="sm"
                    label="Password"
                    v-model="form.password"
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
              <span class="text-lTheme-danger text-[9px]">error</span>
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
import { onMounted, ref, watch, Transition } from "vue";
import { ButtonUI } from "@/components/ui";

const { login, logout, isAuthenticated, initializeAuth } = useAuth();
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
const lateralRightAnimation = ref<string[]>(["duration-800"]);
const lateralLeftAnimation = ref<string[]>(["duration-800"]);

watch(showForm, () => {
  if (showForm.value) {
    verticalAnimation.value.push("translate-y-44");

    isFormAppearing.value = true;
    setTimeout(() => {
      lateralRightAnimation.value.push("translate-x-20");
      lateralLeftAnimation.value.push("translate-x--20");

      setTimeout(() => {
        isMenuOpen.value = true;
      }, 800);
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
    }, 800);
  }
});

const form = ref({
  email: "",
  password: "",
  pseudo: "",
});

onMounted(async () => {
  if (!isAuthenticated.value) {
    await initializeAuth();
  }
});

const toggleButtonActions = () => {
  if (!isMenuOpen.value) {
    showForm.value = !showForm.value;
    return;
  }

  if (showRegister.value) {
    console.log("REGISTER FLOW");
  } else {
    console.log("LOGIN FLOW");
  }
};
</script>

<style scoped lang=""></style>
