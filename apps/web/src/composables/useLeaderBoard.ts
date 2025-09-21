import { useApi } from "./useApi";

export type LeaderboardPlayer = {
  id: string;
  pseudo: string;
  score: number;
  time: number;
  isCurrentUser: boolean;
};

export type CurrentPlayerPosition = {
  rank: number;
  pseudo: string;
  score: number;
  time: number;
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
  const generateMockLeaderboard = () => {
    const players: LeaderboardPlayer[] = [];
    const currentUserId = "YOU-id";

    // Generate top 20 players
    for (let i = 0; i < 20; i++) {
      const isCurrentUser = i === 5; // Simulate current user at position 6

      players.push({
        id: isCurrentUser ? currentUserId : `player-${i}`,
        pseudo: isCurrentUser ? "YOU" : `Player${i + 1}`,
        score: Math.floor(Math.random() * 5000) + 1000,
        time: Math.floor(Math.random() * 300000) + 60000, // 1-5 minutes
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
    };

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
