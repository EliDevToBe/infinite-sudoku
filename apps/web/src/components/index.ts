import { defineAsyncComponent } from "vue";
import BaseLayout from "./BaseLayout.vue";
import FormField from "./FormField.vue";
import MainContent from "./MainContent.vue";
import MainTitle from "./MainTitle.vue";
import MainWrapper from "./MainWrapper.vue";
import OptionBar from "./OptionBar.vue";
import ToggleTheme from "./ToggleTheme.vue";

const LazyModalUI = defineAsyncComponent(() => import("./ui/ModalUI.vue"));
const LazyConfirmModal = defineAsyncComponent(
  () => import("./ConfirmModal.vue"),
);

export {
  BaseLayout,
  OptionBar,
  MainTitle,
  MainWrapper,
  MainContent,
  ToggleTheme,
  FormField,
  LazyModalUI,
  LazyConfirmModal,
};
