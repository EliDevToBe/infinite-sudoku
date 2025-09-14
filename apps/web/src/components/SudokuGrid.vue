<template>
  <!-- Main wrapper -->
  <div class="relative">
    <div :class="[ui.wrapper, { 'blur-[2px]': isInitializing }]">
      <!-- Block Row (3x3)-->
      <div
        v-for="blockRow in blockStructure"
        :key="blockRow.key"
        :class="ui.blockRow"
      >
        <!-- Block Col (3x3)-->
        <div
          v-for="block in blockRow.blocks"
          :key="block.key"
          :class="ui.fullBlock"
        >
          <!-- 3 rows in each block -->
          <div
            v-for="cellRow in block.rows"
            :key="cellRow.key"
            :class="ui.cellRow"
          >
            <!-- and 3 cols in each row (cell isolated)-->
            <div
              v-for="cellData in cellRow.cells"
              :key="cellData.key"
              :class="ui.cellCol"
            >
              <!-- Actual Cell -->
              <Cell
                :current-cell="cellData.cell"
                v-model="cellData.cell.value"
                @update:cell="
                  (value) => handleCellUpdate(value, cellData.position)
                "
                :is-loading="isLoading"
                :is-selected="cellData.isSelected"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <VueIcon
      v-if="isInitializing"
      width="75"
      height="75"
      name="svg-spinners:ring-resize"
      class="text-dTheme-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    />
  </div>
</template>

<script setup lang="ts">
import type { Block, BlockRow, Cell, CellData, CellRow } from "@/utils";
import { computed, watch } from "vue";
import { useSudoku, useApi, useState, usePresetToast } from "@/composables";
import { isFrontError, throwFrontError } from "@/utils/error";
import { useAuth } from "@/composables";
import { useUser } from "@/composables";

const emit = defineEmits<{
  onPuzzleCompleted: [];
}>();

const props = defineProps<{
  isLoading: boolean;
  isInitializing: boolean;
}>();

const { getSelectedCell } = useState();
const { isAuthenticated } = useAuth();
const { currentUser } = useUser();
const { isPuzzleCompleted, isPuzzleSolved, insertVictory } = useSudoku();
const { currentSudokuSave } = useState();
const { fetchApi } = useApi();
const { toastError } = usePresetToast();

const grid = defineModel<Cell[][]>({ required: true });

const ui = {
  wrapper: [
    "inline-block sm:p-2 p-1",
    "bg-dTheme-surfaceOther",
    "shadow-dTheme-accent shadow-sm rounded-lg",
    "border-t-1 border-t-dTheme-light",
    "border-l-1 border-l-dTheme-light/80 ",
    "border-r-1 border-r-dTheme-light/80",
  ],
  blockRow: "flex",
  fullBlock: [
    "flex flex-col rounded-md overflow-hidden",
    "sm:m-0.25 max-sm:m-0.125",
  ],
  cellRow: "flex",
  cellCol:
    "flex flex-col sm:border-1 max-sm:border-0.5 border-dTheme-surfaceOther",
  cell: "bg-gray-300 text-dTheme-surface w-8 h-8 sm:w-12 sm:h-12 transition-all duration-200",
};

// v2 - Pre-computed grid structure instead of template re-rendering
const blockStructure = computed((): BlockRow[] => {
  const selectedCell = getSelectedCell();
  const selectedKey = selectedCell
    ? `${selectedCell.x}-${selectedCell.y}`
    : null;

  const structure: BlockRow[] = [];

  for (let blockRowIndex = 0; blockRowIndex < 3; blockRowIndex++) {
    const blockRow: BlockRow = {
      key: `block-row-${blockRowIndex}`,
      blocks: [],
    };

    for (let blockColIndex = 0; blockColIndex < 3; blockColIndex++) {
      const block: Block = {
        key: `block-${blockRowIndex}-${blockColIndex}`,
        rows: [],
      };

      for (let cellRowIndex = 0; cellRowIndex < 3; cellRowIndex++) {
        const cellRow: CellRow = {
          key: `row-${blockRowIndex}-${blockColIndex}-${cellRowIndex}`,
          cells: [],
        };

        for (let cellColIndex = 0; cellColIndex < 3; cellColIndex++) {
          const x = blockColIndex * 3 + cellColIndex;
          const y = blockRowIndex * 3 + cellRowIndex;
          const cellKey = `${x}-${y}`;

          const cellData: CellData = {
            key: `cell-${cellKey}`,
            cell: grid.value[y][x],
            position: { x, y },
            isSelected: selectedKey === cellKey,
          };

          cellRow.cells.push(cellData);
        }
        block.rows.push(cellRow);
      }
      blockRow.blocks.push(block);
    }
    structure.push(blockRow);
  }

  return structure;
});

const handleCellUpdate = (
  value: number,
  position: { x: number; y: number }
) => {
  grid.value[position.y][position.x].value = value;
};

watch(
  grid,
  async () => {
    if (isPuzzleCompleted(grid.value)) {
      if (!currentSudokuSave.value) return;
      try {
        const { data, error } = await fetchApi({
          path: "/grid/:id",
          method: "GET",
          params: {
            id: currentSudokuSave.value.id,
          },
        });

        if (error) {
          throwFrontError(error.message, { description: "An error occurred" });
          return;
        }
        if (!data) {
          throwFrontError("No data", { description: "An error occurred" });
          return;
        }

        if (isPuzzleSolved(grid.value, data.solution as number[][])) {
          emit("onPuzzleCompleted");
          if (isAuthenticated.value && currentUser.value) {
            insertVictory();
          }
        }
      } catch (error) {
        if (isFrontError(error)) {
          toastError(error, { description: error.message });
        } else {
          toastError(error, { description: "An error occurred" });
        }
      }
    }
  },
  { deep: true }
);
</script>

<style scoped lang=""></style>
