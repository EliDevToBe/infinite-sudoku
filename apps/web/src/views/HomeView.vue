<template>
  <MainWrapper>
    <div :class="ui.content">
      <div class="h-5 flex flex-col gap-2">
        <button :class="ui.button" @click="call">Login test</button>
        <button v-if="isAuthenticated" :class="ui.button" @click="logout">
          Logout
        </button>
      </div>
    </div>
  </MainWrapper>
</template>

<script setup lang="ts">
import MainWrapper from "../components/MainWrapper.vue";
import { useAuth } from "@/composables/useAuth";
import { useNavigation } from "@/composables/useNavigation";

const { login, isAuthenticated, logout } = useAuth();
const { navigateTo } = useNavigation();

const ui = {
  content: "flex flex-col h-full items-center justify-center bg-cyan-200",
  title: "text-3xl font-bold mb-8",
  button: "bg-red-500 text-white p-2 rounded-md cursor-pointer",
};

const call = async () => {
  await login("admin@rncp.com", "<this is not the password>");
  if (isAuthenticated.value) {
    navigateTo("difficulty");
  }
};
</script>

<style scoped lang=""></style>
