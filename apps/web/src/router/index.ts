import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { routes } from "./routerRoutes";

const { isAuthenticated, initializeAuth } = useAuth();

export type RouteName = (typeof routes)[number]["name"];
export type RouteParams = Record<RouteName, null | Record<string, string>>;

// Type-safe navigation
export type NavigateTo = <T extends keyof RouteParams>(
  route: T,
  params?: RouteParams[T],
) => void;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

let authInitialized = false;

router.beforeEach(async (to, _from) => {
  if (!authInitialized && !isAuthenticated.value && to.name !== "home") {
    await initializeAuth();
    authInitialized = true;
  }

  if (!isAuthenticated.value && to.name !== "home") {
    return { name: "home" };
  }
});

export default router;
