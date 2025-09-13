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

  return { hardSave, loadHardSave };
};
