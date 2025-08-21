import { useRouter } from "vue-router";
import type { RouteNamedMap } from "vue-router/auto-routes";

export const useNavigation = () => {
  const router = useRouter();

  const navigateTo = <T extends keyof RouteNamedMap>(
    route: T,
    ...args: RouteNamedMap[T] extends { params: infer P }
      ? [params?: P]
      : [params?: never]
  ) => {
    if (args[0]) {
      router.push({ name: route, params: args[0] });
    } else {
      router.push({ name: route });
    }
  };

  return {
    navigateTo,
  };
};
