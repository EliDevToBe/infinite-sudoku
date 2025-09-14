import type { DifficultyOptions } from "@shared/utils/sudoku/helper";
import { throwFrontError } from "@/utils/error";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";
import { useState } from "./useState";
import { useSudoku } from "./useSudoku";
import { useUser } from "./useUser";

const { fetchApi } = useApi();
const { currentUser } = useUser();
const { isAuthenticated } = useAuth();
const { currentSudokuSave } = useState();
const { parsePuzzle } = useSudoku();

export const useSave = () => {
  const hardSave = async () => {
    if (!currentUser.value || !isAuthenticated.value) {
      throwFrontError("Current user not found", { context: "[hardSave]" });
      return;
    }

    if (!currentSudokuSave.value) {
      throwFrontError("Local sudoku save not found", {
        context: "[hardSave]",
      });
      return;
    }
    const parsedPuzzle = parsePuzzle(currentSudokuSave.value.value);

    const { data, error } = await fetchApi({
      path: "/user-grid",
      method: "POST",
      body: {
        user_id: currentUser.value.id,
        grid_id: currentSudokuSave.value.id,
        backup_wip: parsedPuzzle,
      },
    });

    if (error) {
      throwFrontError(error.message, {
        context: "[hardSave]",
        error,
      });
      return;
    }
    if (!data) {
      throwFrontError("No data", { context: "[hardSave]", data });
      return;
    }

    return true;
  };

  const loadHardSave = async (userId: string) => {
    const { data, error } = await fetchApi({
      path: "/user-grid/user/:id",
      method: "GET",
      params: {
        id: userId,
      },
    });

    if (error) {
      throwFrontError(error.message, { context: "[loadHardSave]", error });
      return;
    }
    if (!data) {
      throwFrontError("No data", { context: "[loadHardSave]", data });
      return;
    }

    return data;
  };

  const checkAndDeleteHardSave = async (difficulty: DifficultyOptions) => {
    if (!currentUser.value || !isAuthenticated.value) {
      throwFrontError("Current user not found", {
        context: "[checkAndDeleteHardSave]",
      });
      return;
    }
    const userId = currentUser.value.id;

    const hardSaves = await loadHardSave(currentUser.value.id);
    if (!hardSaves) {
      throwFrontError("No data", {
        context: "[checkAndDeleteHardSave]",
        data: hardSaves,
      });
      return false;
    }

    const hardSaveToDelete = hardSaves.filter(
      (hardSave) => hardSave.difficulty === difficulty,
    );

    if (!hardSaveToDelete) {
      return true;
    }

    const promises = hardSaveToDelete.map((hardSave) => {
      return fetchApi({
        path: "/user-grid/delete/:id/:userId",
        method: "DELETE",
        params: { id: hardSave.id, userId },
      });
    });

    await Promise.all(promises);

    return true;
  };

  return { hardSave, loadHardSave, checkAndDeleteHardSave };
};
