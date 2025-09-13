import { isFrontError, throwFrontError } from "@/utils/error";
import { usePresetToast } from "./toast";
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
const { toastError } = usePresetToast();

export const useSave = () => {
  const hardSave = async () => {
    try {
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
        throwFrontError(error.message, { context: "[hardSave]" });
        return;
      }
      if (!data) {
        throwFrontError("No data", { context: "[hardSave]" });
        return;
      }

      return true;
    } catch (error) {
      if (isFrontError(error)) {
        toastError(error, { description: error.message });
      } else {
        toastError(error, { description: "An error occurred" });
      }

      return false;
    }
  };

  const loadHardSave = (_wip: string) => {
    // WIP
  };

  return { hardSave, loadHardSave };
};
