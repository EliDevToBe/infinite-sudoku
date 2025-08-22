<template>
  <MainWrapper>
    <div :class="ui.content">
      <div :class="ui.menuWrapper" class="bg-red-300">
        <ButtonUI size="lg" @click="navigateTo('/play/')">PLAY</ButtonUI>

        <!-- REGISTER / LOGIN -->
        <div class="flex flex-col items-center isolate">
          <div
            v-if="!isAuthenticated"
            class="relative flex items-center"
            :class="verticalAnimation.join(' ')"
          >
            <ButtonUI
              size="sm"
              class="z--1 absolute transition-transform transition-ease"
              :class="lateralLeftAnimation.join(' ')"
            >
              Register
            </ButtonUI>

            <ButtonUI
              class="transition-transform transition-ease"
              :class="lateralRightAnimation.join(' ')"
              size="md"
              @click="toggleForm"
            >
              Login
            </ButtonUI>
          </div>

          <ButtonUI v-else @click="logout"> Logout </ButtonUI>

          <!-- FORM -->
          <div v-if="isAnimatedPosition" :class="ui.formWrapper">
            <FormField
              name="pseudo"
              type="text"
              placeholder="Pseudo"
              size="sm"
              label="Pseudo"
              v-model="pseudo"
            />

            <FormField
              name="email"
              type="email"
              placeholder="Email"
              size="sm"
              label="Email"
              v-model="email"
            />

            <div>
              <FormField
                name="password"
                type="password"
                placeholder="Password"
                size="sm"
                label="Password"
                v-model="password"
              />
              <div
                role="link"
                class="text-[8px] text-lTheme-font place-self-center hover:underline hover:cursor-pointer"
                @click="
                  console.warn('Forgotten password flow not yet implemented')
                "
              >
                Forgot password?
              </div>
            </div>
          </div>
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
import { onMounted, ref, watch } from "vue";
import { ButtonUI } from "@/components/ui";

const { login, logout, isAuthenticated, initializeAuth } = useAuth();
const { navigateTo } = useNavigation();

const ui = {
  content: "flex justify-center items-center h-full",
  title: "text-3xl font-bold mb-8",
  menuWrapper: "flex flex-col gap-2 items-center w-75 h-75",
  formWrapper:
    "flex flex-col w-45 p-2 gap-2 items-center bg-dTheme-light absolute z-1 rounded-sm",
};

const showForm = ref(false);
const isAnimatedPosition = ref(false);
const verticalAnimation = ref<string[]>(["duration-500"]);
const lateralRightAnimation = ref<string[]>(["duration-1s"]);
const lateralLeftAnimation = ref<string[]>(["duration-1s"]);

watch(isAnimatedPosition, () => console.log(isAnimatedPosition.value));

watch(showForm, () => {
  if (showForm.value) {
    verticalAnimation.value.push("translate-y-44");

    setTimeout(() => {
      lateralRightAnimation.value.push("translate-x-20");
      lateralLeftAnimation.value.push("translate-x--20");

      setTimeout(() => {
        isAnimatedPosition.value = true;
      }, 1000);
    }, 500);
  } else {
    lateralRightAnimation.value.pop();
    lateralLeftAnimation.value.pop();

    setTimeout(() => {
      verticalAnimation.value.pop();

      setTimeout(() => {
        isAnimatedPosition.value = false;
      }, 500);
    }, 1000);
  }
});

const email = ref("");
const password = ref("");
const pseudo = ref("");

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const call = async () => {
  await login("admin@rncp.com", "<this is not the password>");
};

onMounted(async () => {
  if (!isAuthenticated.value) {
    await initializeAuth();
  }
});
</script>

<style scoped lang=""></style>
