<template>
  <MainWrapper>
    <template #sub-header>
      <div class="flex items-center justify-center">
        <OptionBar />
      </div>
    </template>

    <MainContent class="h-max gap-5 overflow-hidden p-5">
      <h1 class="text-3xl font-bold sticky top-0">DESIGN VIEW</h1>
      <div :class="ui.buttonWrapper">
        <div :class="ui.buttonContainer">
          <ButtonUI size="icon" variant="danger">x</ButtonUI>
          <ButtonUI size="sm" disabled>Disabled</ButtonUI>
          <ButtonUI size="md">Button 3</ButtonUI>
          <ButtonUI size="lg">Button 4</ButtonUI>
        </div>
        <div :class="ui.buttonContainer">
          <ButtonUI size="icon-xs" variant="ghost">x</ButtonUI>
          <ButtonUI size="sm" variant="secondary">Button 2</ButtonUI>
          <ButtonUI size="md" isLoading>Loading</ButtonUI>
          <ButtonUI
            size="lg"
            variant="secondary"
            @click="console.log(currentUser)"
            >Who am I ?</ButtonUI
          >
        </div>
      </div>

      <FormField
        name="pseudo"
        type="text"
        placeholder="DISABLED"
        size="sm"
        label="Pseudo"
        disabled
      />

      <form :class="ui.formWrapper">
        <div :class="ui.formContainer">
          <label for="name">Name</label>
          <InputUI
            type="text"
            id="name"
            placeholder="Enter your name"
            size="sm"
            variant="secondary"
            hasError
          />
        </div>
        <div :class="ui.formContainer">
          <label for="email">Email</label>
          <InputUI type="email" id="email" placeholder="Enter your email" />
        </div>
        <div :class="ui.formContainer">
          <label for="password">Password</label>
          <InputUI
            type="password"
            id="password"
            placeholder="Enter your password"
            size="lg"
          />
        </div>
      </form>

      <div>
        <ButtonUI size="sm" variant="danger" @click="showToast">
          Multi Toasting (x3)
        </ButtonUI>
      </div>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { FormField, MainContent, MainWrapper, ToggleTheme } from "@/components";
import { ButtonUI, InputUI } from "@/components/ui";
import { usePresetToast } from "@/composables/toast";
import { useUser } from "@/composables/useUser";
import { ref } from "vue";
// definePage({ meta: { requiresAuth: true, roles: ["admin"] } });

const ui = {
  buttonWrapper: "flex flex-col w-[75%] gap-5",
  buttonContainer: "flex justify-between items-center gap-5",
  formWrapper: "flex flex-col w-[75%] gap-5",
  formContainer: "flex flex-col gap-2",
};

const { currentUser } = useUser();
const { toastInfo, toastSuccess, toastError } = usePresetToast();

const showToast = () => {
  toastInfo({ description: "This is a info toast" });
  toastSuccess({ description: "This is a success toast" });
  toastError(new Error("This is a new error"), {
    description: "This is a error toast",
  });
};
</script>

<style scoped lang=""></style>
