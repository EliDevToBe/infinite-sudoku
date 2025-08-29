<template>
  <!-- Main wrapper -->
  <div :class="ui.wrapper">
    <!-- Block Row (3x3)-->
    <div
      v-for="blockRow in 3"
      :key="`block-row-${blockRow}`"
      :class="ui.blockRow"
    >
      <!-- Block Col (3x3)-->
      <!-- At this step, the full block is created -->
      <div
        v-for="blockCol in 3"
        :key="`block-col-${blockCol}`"
        :class="ui.fullBlock"
      >
        <!-- 3 rows in each block -->
        <div
          v-for="cellRow in 3"
          :key="`cell-row-${cellRow}`"
          :class="ui.cellRow"
        >
          <!-- and 3 cols in each row (cell isolated)-->
          <div
            v-for="cellCol in 3"
            :key="`cell-col-${cellCol}`"
            :class="ui.cellCol"
          >
            <!-- Actual Cell -->
            <Cell
              :currentCell="
                grid[(blockRow - 1) * 3 + (cellRow - 1)][
                  (blockCol - 1) * 3 + (cellCol - 1)
                ]
              "
              v-model="
                grid[(blockRow - 1) * 3 + (cellRow - 1)][
                  (blockCol - 1) * 3 + (cellCol - 1)
                ].value
              "
              @update:cell="
                (value) => {
                  handleCellUpdate(value, {
                    x: (blockCol - 1) * 3 + (cellCol - 1),
                    y: (blockRow - 1) * 3 + (cellRow - 1),
                  });
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cell } from "@/utils";

const grid = defineModel<Cell[][]>({ required: true });

const ui = {
  wrapper: [
    "inline-block sm:p-2 p-1 m-t-2",
    "bg-dTheme-surfaceOther",
    "shadow-dTheme-accent shadow-sm rounded-lg",
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

const handleCellUpdate = (
  value: number,
  position: { x: number; y: number }
) => {
  grid.value[position.y][position.x].value = value;
};
</script>

<style scoped lang=""></style>
