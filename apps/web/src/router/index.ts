import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import DifficultyView from "../views/DifficultyView.vue";
import HomeView from "../views/HomeView.vue";
import PuzzlesView from "../views/PuzzlesView.vue";
import SudokuGridView from "../views/SudokuGridView.vue";

const { isAuthenticated } = useAuth();

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/difficulty",
    name: "difficulty",
    component: DifficultyView,
  },
  {
    path: "/puzzle/:difficulty",
    name: "puzzle-choice",
    component: PuzzlesView,
    props: true,
  },
  {
    path: "/puzzle/:difficulty/:id",
    name: "puzzle-game",
    component: SudokuGridView,
    props: true,
  },
] as const;

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

router.beforeEach(async (to, _from) => {
  if (!isAuthenticated.value && to.name !== "home") {
    return { name: "home" };
  }
});

export default router;
