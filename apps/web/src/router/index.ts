import { createRouter, createWebHistory } from "vue-router";
import { handleHotUpdate, routes } from "vue-router/auto-routes";
import { useAuth, useUser } from "@/composables";
import { usePresetToast } from "@/composables/toast";

const { isAuthenticated, initializeAuth } = useAuth();
const { currentUser } = useUser();
const { toastInfo } = usePresetToast();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

if (import.meta.hot) {
  handleHotUpdate(router);
}

let authInitialized = false;

router.beforeEach(async (to, _from) => {
  if (to.name === "/") {
    return { name: "/play/" };
  }

  // If not authenticated, try to initialize auth once
  if (!authInitialized && !isAuthenticated.value) {
    const success = await initializeAuth();

    if (success && currentUser.value) {
      toastInfo({
        description: `Welcome back ${currentUser.value.pseudo} !`,
      });
    }

    authInitialized = true;
  }

  // - If route need auth
  // - User is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: "/play/" };
  }

  // - If route need auth
  // - User is authenticated
  // - User does not have the required role
  if (
    (to.meta.requiresAuth && !isAuthenticated.value) ||
    (to.meta.roles &&
      !(to.meta.roles as string[]).includes(currentUser.value?.role || ""))
  ) {
    return { name: "/play/" };
  }
});

export default router;
