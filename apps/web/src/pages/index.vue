<template>
  <MainWrapper>
    <div :class="ui.content">
      <div class="h-5 flex flex-col gap-2">
        <button v-if="!isAuthenticated" :class="ui.button" @click="call">
          Login test
        </button>
        <button v-else :class="ui.button" @click="navigateTo('/play/')">
          Play
        </button>
        <button v-if="isAuthenticated" :class="ui.button" @click="logout">
          Logout
        </button>
        <button
          @click="
            () => {
              console.log('CLICKED');
              navigateTo('/design/');
            }
          "
        >
          GO DESIGN
        </button>
      </div>
    </div>
  </MainWrapper>
</template>

<script setup lang="ts">
import { MainWrapper } from "@/components";
import { useAuth, useNavigation } from "@/composables";
import { onMounted } from "vue";

const { login, logout, isAuthenticated, initializeAuth } = useAuth();
const { navigateTo } = useNavigation();

const ui = {
  content: "flex flex-col h-full items-center justify-center bg-cyan-200",
  title: "text-3xl font-bold mb-8",
  button: "bg-red-500 text-white p-2 rounded-md cursor-pointer",
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
