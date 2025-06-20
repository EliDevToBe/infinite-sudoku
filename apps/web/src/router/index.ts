import { createRouter, createWebHistory } from "vue-router";
import DifficultyView from "../views/DifficultyView.vue";
import SudokuGridView from "../views/game/SudokuGridView.vue";
import HomeView from "../views/HomeView.vue";
import PuzzlesView from "../views/PuzzlesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: "/puzzles/:difficulty",
      name: "puzzles",
      component: PuzzlesView,
      props: true,
    },
    {
      path: "/sudoku-game/:difficulty/:id",
      name: "sudoku-game",
      component: SudokuGridView,
      props: true,
    },
  ],
});

export default router;
