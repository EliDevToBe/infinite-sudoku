<template>
  <header>
    <div>
      <HelloWorld msg="You did it!" />

      <nav class="bg-amber-400">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <div class="text-red-500" @click="handleClick">Hello</div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const handleClick = () => {
  router.push("/about");
};
</script>
