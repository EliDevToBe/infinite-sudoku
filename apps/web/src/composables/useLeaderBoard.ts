import { useApi } from "./useApi";

export type LeaderboardPlayer = {
  id: string;
  pseudo: string;
  score: number;
  time: number;
  puzzleCount: number;
  isCurrentUser: boolean;
};

export type CurrentPlayerPosition = {
  rank: number;
  pseudo: string;
  score: number;
  time: number;
  puzzleCount: number;
};

export const useLeaderBoard = () => {
  const { fetchApi } = useApi();

  const fetchLeaderboard = async (period: "daily" | "weekly" | "monthly") => {
    try {
      const { data, error } = await fetchApi({
        path: "/leaderboard/:period",
        method: "GET",
        params: { period },
      });

      if (error) {
        throw new Error("Failed to fetch leaderboard data");
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // Mock data generator
  const generateMockLeaderboard = async (
    period: "daily" | "weekly" | "monthly",
  ) => {
    const players: LeaderboardPlayer[] = [];
    const currentUserId = "YOU-id";

    const limit = period === "daily" ? 2 : period === "weekly" ? 5 : 20;

    // Generate top 20 players
    for (let i = 0; i < limit; i++) {
      const isCurrentUser = i === 5; // Simulate current user at position 6

      players.push({
        id: isCurrentUser ? currentUserId : `player-${i}`,
        pseudo: isCurrentUser ? "YOU" : `Player${i + 1}`,
        score: Math.floor(Math.random() * 5000) + 1000,
        time: Math.floor(Math.random() * 300000) + 60000, // 1-5 minutes
        puzzleCount: Math.floor(Math.random() * 10) + 1,
        isCurrentUser,
      });
    }

    // Sort by score (descending)
    players.sort((a, b) => b.score - a.score);

    // Add current player position if not in top 20
    const currentPlayer: CurrentPlayerPosition = {
      rank: 24,
      pseudo: "YOU",
      score: Math.floor(Math.random() * 2000) + 500,
      time: Math.floor(Math.random() * 600000) + 120000, // 2-10 minutes
      puzzleCount: Math.floor(Math.random() * 10) + 1,
    };

    // Simulate request/response latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      players,
      currentPlayer: currentPlayer.rank > 20 ? currentPlayer : null,
    };
  };

  return {
    generateMockLeaderboard,
    fetchLeaderboard,
  };
};
