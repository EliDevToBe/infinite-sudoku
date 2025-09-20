import type { Cell, DifficultyOptions } from "@shared/utils/sudoku/helper";
import { throwFrontError } from "@/utils/error";
import { useApi } from "./useApi";
import { useAuth } from "./useAuth";
import { useState } from "./useState";
import { useTimer } from "./useTimer";
import { useUser } from "./useUser";

const { fetchApi } = useApi();
const { currentUser } = useUser();
const { isAuthenticated } = useAuth();
const { currentSudokuSave, setSudokuSave } = useState();
const { getTimerActiveTime } = useTimer();

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

    const { data, error } = await fetchApi({
      path: "/user-grid",
      method: "POST",
      body: {
        user_id: currentUser.value.id,
        grid_id: currentSudokuSave.value.id,
        backup_wip: currentSudokuSave.value.value,
        time: getTimerActiveTime(),
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

    return data.id;
  };

  const loadHardSave = async (
    userId: string,
  ): Promise<
    | {
        id: string;
        difficulty: DifficultyOptions;
        hardSave: Cell[][];
        time: number;
      }[]
    | null
  > => {
    const { data, error } = await fetchApi({
      path: "/user-grid/user/:id",
      method: "GET",
      params: {
        id: userId,
      },
    });

    if (error) {
      throwFrontError(error.message, { context: "[loadHardSave]", error });
      return null;
    }
    if (!data) {
      throwFrontError("No data", { context: "[loadHardSave]", data });
      return null;
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
      (formattedGrid) => formattedGrid.difficulty === difficulty,
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

  const checkHardSavesToLocal = async (userId: string) => {
    const hardSaves = await loadHardSave(userId);

    if (hardSaves && hardSaves.length > 0) {
      hardSaves.forEach((save) => {
        setSudokuSave(save.difficulty, {
          value: save.hardSave,
          id: save.id,
          time: save.time,
        });
      });
    }
  };

  return {
    hardSave,
    loadHardSave,
    checkAndDeleteHardSave,
    checkHardSavesToLocal,
  };
};
