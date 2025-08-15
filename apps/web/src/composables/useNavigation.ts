import { useRouter } from "vue-router";
import type { NavigateTo } from "@/router";

export const useNavigation = () => {
  const router = useRouter();

  const navigateTo: NavigateTo = (route, params) => {
    if (params) {
      router.push({ name: route, params });
    } else {
      router.push({ name: route });
    }
  };

  return {
    navigateTo,
  };
};
