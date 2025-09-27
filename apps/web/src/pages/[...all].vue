<template>
  <MainWrapper>
    <MainContent :class="ui.contentWrapper">
      <div class="space-y-6">
        <!-- 404 Icon/Number -->
        <div :class="ui.errorCode">404</div>

        <!-- Error Message -->
        <div class="space-y-2">
          <h1 :class="ui.notFound">Page Not Found</h1>
          <p :class="ui.notFoundSubText">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex gap-4 justify-center">
          <ButtonUI variant="ghost" @click="goBack">Go back</ButtonUI>
        </div>
      </div>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import MainWrapper from "@/components/MainWrapper.vue";
import MainContent from "@/components/MainContent.vue";

const ui = {
  contentWrapper: "flex flex-col items-center justify-center text-center pb-10",
  errorCode: "text-8xl font-bold text-dTheme-accentDarker opacity-80",
  notFound: "text-2xl font-semibold text-dTheme-font",
  notFoundSubText: "text-dTheme-light/80 w-full px-5",
};

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/play");
  }
};
</script>
