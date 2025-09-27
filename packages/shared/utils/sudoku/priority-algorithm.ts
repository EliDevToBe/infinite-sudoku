export type Position = { row: number; col: number };

/**
 * Creates a prioritized list of cell positions to attempt removal from.
 * This strategy aims to create more human-like and interesting puzzles using patterns.
 * Most efficient for the time being.
 * @returns An array of positions, sorted by priority zone.
 */
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

export const patternPriorityV2 = (): Position[] => {
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

  // IMPROVED: Add randomness to zone priority order to break symmetry
  const result: Position[] = [];

  // Randomly interleave zones instead of strict priority order
  const zoneWeights = {
    diagonals: 0.3, // Higher probability to be picked early
    corners: 0.25,
    edges: 0.2,
    others: 0.15,
    centers: 0.1, // Lower probability, but still can appear early
  };

  // Create weighted distribution for zone selection
  const zoneCopies = { ...zones };

  while (Object.values(zoneCopies).some((zone) => zone.length > 0)) {
    // Calculate current weights based on remaining zones
    const availableZones = Object.entries(zoneCopies).filter(
      ([_, zone]) => zone.length > 0,
    );

    if (availableZones.length === 0) break;

    // Add randomness: sometimes pick randomly instead of by weight
    const shouldUseRandomPick = Math.random() < 0.3; // 30% chance for pure randomness

    let selectedZone: string;

    if (shouldUseRandomPick) {
      // Pure random selection
      selectedZone =
        availableZones[Math.floor(Math.random() * availableZones.length)][0];
    } else {
      // Weighted selection
      const totalWeight = availableZones.reduce(
        (sum, [zoneName]) =>
          sum + zoneWeights[zoneName as keyof typeof zoneWeights],
        0,
      );

      let randomValue = Math.random() * totalWeight;
      selectedZone = availableZones[0][0]; // fallback

      for (const [zoneName] of availableZones) {
        randomValue -= zoneWeights[zoneName as keyof typeof zoneWeights];
        if (randomValue <= 0) {
          selectedZone = zoneName;
          break;
        }
      }
    }

    // Take 1-3 positions from selected zone (adds more randomness)
    const zone = zoneCopies[selectedZone as keyof typeof zoneCopies];
    const takeCount = Math.min(
      zone.length,
      Math.floor(Math.random() * 3) + 1, // Take 1-3 positions
    );

    for (let i = 0; i < takeCount; i++) {
      if (zone.length > 0) {
        result.push(zone.shift()!);
      }
    }
  }

  return result;
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

export const patternMap = {
  pattern: patternPriority,
  patternV2: patternPriorityV2,
  gaussian: gaussianPriority,
};
