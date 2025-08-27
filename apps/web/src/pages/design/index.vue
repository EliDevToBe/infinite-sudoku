<template>
  <MainWrapper>
    <template #sub-header>
      <div class="flex justify-center items-center">
        <div class="bg-red-200">Test Slot #sub-header</div>
        <ToggleTheme />
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

      <div>
        <div
          class="flex w-150 items-center justify-between bg-dTheme-surfaceOther rounded-md p-1 pl-2 pr-2"
        >
          <div
            class="flex grow box-border p-1 justify-center cursor-pointer"
            :class="{
              'bg-dTheme-surface rounded-md': difficulty === 'easy',
            }"
            @click="difficulty = 'easy'"
          >
            <input
              type="radio"
              value="easy"
              name="difficulty"
              id="easy"
              appearance-none
              v-model="difficulty"
              :checked="difficulty === 'easy'"
            />
            <label for="easy">Easy</label>
          </div>
          <div
            class="flex grow box-border p-1 justify-center"
            :class="{
              'bg-dTheme-surface rounded-md': difficulty === 'medium',
            }"
            @click="difficulty = 'medium'"
          >
            <input
              type="radio"
              value="medium"
              name="difficulty"
              id="medium"
              appearance-none
              v-model="difficulty"
              :checked="difficulty === 'medium'"
            />
            <label for="medium">Medium</label>
          </div>
          <div
            class="flex grow box-border p-1 justify-center"
            :class="{
              'bg-dTheme-surface rounded-md': difficulty === 'hard',
            }"
            @click="difficulty = 'hard'"
          >
            <input
              type="radio"
              value="hard"
              name="difficulty"
              id="hard"
              appearance-none
              v-model="difficulty"
              :checked="difficulty === 'hard'"
            />
            <label for="hard">Hard</label>
          </div>
          <div
            class="flex grow box-border p-1 justify-center"
            :class="{
              'bg-dTheme-surface rounded-md': difficulty === 'hardcore',
            }"
            @click="difficulty = 'hardcore'"
          >
            <input
              type="radio"
              value="hardcore"
              name="difficulty"
              id="hardcore"
              appearance-none
              v-model="difficulty"
              :checked="difficulty === 'hardcore'"
              class=""
            />
            <label for="hardcore">Hardcore</label>
          </div>
        </div>
      </div>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { FormField, MainContent, MainWrapper, ToggleTheme } from "@/components";
import { ButtonUI, InputUI } from "@/components/ui";
import { usePresetToast } from "@/composables/toast";
import { useUser } from "@/composables/useUser";
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
