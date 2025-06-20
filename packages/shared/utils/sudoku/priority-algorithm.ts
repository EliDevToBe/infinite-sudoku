export type Position = { row: number; col: number };

// Most efficient
export const patternPriority = (): Position[] => {
  // Divide board into zones for batch randomization
  const zones = {
    diagonals: [] as Position[],
    corners: [] as Position[],
    edges: [] as Position[],
    centers: [] as Position[],
    others: [] as Position[],
  };

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (i === j || i + j === 8) {
        zones.diagonals.push({ row: i, col: j });
      } else if ((i === 0 || i === 8) && (j === 0 || j === 8)) {
        zones.corners.push({ row: i, col: j });
      } else if (i === 0 || i === 8 || j === 0 || j === 8) {
        zones.edges.push({ row: i, col: j });
      } else if (i % 3 === 1 && j % 3 === 1) {
        zones.centers.push({ row: i, col: j });
      } else {
        zones.others.push({ row: i, col: j });
      }
    }
  }

  // Shuffle each zone independently
  for (const zone of Object.values(zones)) {
    for (let i = zone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [zone[i], zone[j]] = [zone[j], zone[i]];
    }
  }

  // Combine zones in priority order with some overlap
  return [
    ...zones.diagonals,
    ...zones.corners,
    ...zones.edges,
    ...zones.others,
    ...zones.centers,
  ];
};

// Helper method for smart cell selection
export const gaussianPriority = (): Position[] => {
  const positions: { row: number; col: number; priority: number }[] = [];

  const center = 4; // Center index for 9x9 board
  const sigma = 3; // Controls how quickly priority drops off from center; 4 almost flat
  const randomFactor = Math.random() * 0.8; // Random factor to add to the priority

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      // Gaussian-based priority: highest at center, smooth drop-off to edges
      const distSq = (i - center) ** 2 + (j - center) ** 2;
      const priority = Math.exp(-distSq / (2 * sigma * sigma)) + randomFactor;
      positions.push({ row: i, col: j, priority });
    }
  }

  // Sort descending: higher priority (closer to center) first
  return positions
    .sort((a, b) => b.priority - a.priority)
    .map(({ row, col }) => ({ row, col }));
};
