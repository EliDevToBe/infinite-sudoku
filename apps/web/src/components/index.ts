import { defineAsyncComponent } from "vue";
import BaseLayout from "./BaseLayout.vue";
import FormField from "./FormField.vue";
import MainContent from "./MainContent.vue";
import MainTitle from "./MainTitle.vue";
import MainWrapper from "./MainWrapper.vue";
import OptionBar from "./OptionBar.vue";
import ToggleTheme from "./ToggleTheme.vue";

const LazyModalUI = defineAsyncComponent(() => import("./ui/ModalUI.vue"));
const LazyActionModal = defineAsyncComponent(() => import("./ActionModal.vue"));
const LazyTooltipUI = defineAsyncComponent(() => import("./ui/TooltipUI.vue"));

export {
  BaseLayout,
  OptionBar,
  MainTitle,
  MainWrapper,
  MainContent,
  ToggleTheme,
  FormField,
  LazyModalUI,
  LazyActionModal,
  LazyTooltipUI,
};
