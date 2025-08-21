import { DifficultyView, HomeView, PuzzlesView, SudokuGridView } from "@/views";

export const routes = [
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
