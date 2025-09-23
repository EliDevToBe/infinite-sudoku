import type { FastifyReply, FastifyRequest } from "fastify";

export const LeaderboardController = () => {
  const getLeaderboard = async (
    request: FastifyRequest<{
      Params: { period: "daily" | "weekly" | "monthly" };
    }>,
    reply: FastifyReply,
  ) => {
    const { period } = request.params;
    const { prisma } = request.server;

    try {
      // Get current user ID from token
      const authUserId = request.user.id;

      if (!authUserId) {
        return reply.status(401).send({
          clientMessage: "Unauthorized",
        });
      }

      // Building where clause based on period
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "daily": {
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          break;
        }

        case "weekly": {
          // 0 = Sunday, 1 = Monday,
          const dayOfWeek = now.getDay();
          // Days from last Monday
          const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          // Actual Monday of the current week
          const startOfWeek = now.getDate() - daysFromMonday;
          startDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek);
          break;
        }

        case "monthly": {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        }

        default: {
          return reply.status(400).send({
            clientMessage: "Invalid period. Must be daily, weekly, or monthly",
          });
        }
      }

      const top20Grids = await prisma.user_grid.groupBy({
        by: ["user_id"],
        where: {
          finished_at: {
            gte: startDate,
            lte: now,
          },
          score: {
            not: null,
          },
        },
        _sum: {
          score: true,
        },
        _avg: {
          time: true,
        },
        _count: {
          grid_id: true,
        },
        orderBy: {
          _sum: {
            score: "desc",
          },
        },
        take: 20,
      });

      // No data found
      if (top20Grids.length === 0) {
        return reply.send({
          players: [],
          currentPlayer: null,
        });
      }

      request.server.log.info(`Top grids count: ${top20Grids.length}`);

      // Get user information for the top 20 users
      const userIds = top20Grids.map((grid) => grid.user_id);
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          pseudo: true,
        },
      });

      const aggregatedUsers = top20Grids.map((grid) => ({
        ...grid,
        user: users.find((user) => user.id === grid.user_id),
      }));
      request.server.log.info(
        `Aggregated keys: ${Object.keys(aggregatedUsers[0])}`,
      );

      // Create a map for quick user lookup
      // Ready format for the map
      const formattedAggregatedUsers = aggregatedUsers.map(
        (aggregatedUser) => ({
          ...aggregatedUser,
          _avg: {
            time: Math.round(aggregatedUser._avg.time ?? 0),
          },
        }),
      );
      const userMap = new Map(
        formattedAggregatedUsers.map((aggregatedUser) => {
          return [aggregatedUser.user_id, aggregatedUser];
        }),
      );
      request.server.log.info(`Map size: ${userMap.size}`);

      // Get current user's position if not in top 20
      let currentPlayerPosition = null;
      const currentUserInTop20 = aggregatedUsers.find(
        (topGrid) => topGrid.user_id === authUserId,
      );

      if (!currentUserInTop20) {
        // Retrieve current user aggregated score and time
        const currentUserGrid = await prisma.user_grid.groupBy({
          by: ["user_id"],
          where: {
            user_id: authUserId,
            finished_at: {
              gte: startDate,
              lte: now,
            },
            score: {
              not: null,
            },
          },
          _sum: {
            score: true,
          },
          _avg: {
            time: true,
          },
          _count: {
            grid_id: true,
          },
          orderBy: {
            _sum: {
              score: "desc",
            },
          },
        });

        request.server.log.info(
          `Current user grid count: ${currentUserGrid.length}`,
        );

        // Retrieve current user information
        const currentUserInfo = await prisma.user.findUnique({
          where: {
            id: authUserId,
          },
          select: {
            id: true,
            pseudo: true,
          },
        });

        // Should never happen
        if (!currentUserInfo) {
          return reply.status(404).send({
            clientMessage: "User not found",
          });
        }

        /**
         * If data for the current period, we format it in the map
         * and calculate precise rank of current user.
         *
         * Else, the currentPlayerPosition is null.
         */
        if (currentUserGrid.length !== 0) {
          // Set aggregated data in the map
          userMap.set(authUserId, {
            ...currentUserGrid[0],
            user: currentUserInfo,
            _avg: {
              time: Math.round(currentUserGrid[0]._avg.time ?? 0),
            },
          });

          if (currentUserGrid && currentUserGrid[0]._sum.score !== null) {
            const actualScore = currentUserGrid[0]._sum.score;
            const actualTime = currentUserGrid[0]._avg.time ?? 0;
            const actualPuzzleCount = currentUserGrid[0]._count.grid_id;

            // Count users with higher aggregated scores
            const usersWithHigherScores = await prisma.user_grid.groupBy({
              by: ["user_id"],
              where: {
                finished_at: {
                  gte: startDate,
                  lte: now,
                },
                score: {
                  not: null,
                },
              },
              _sum: {
                score: true,
              },
              having: {
                score: {
                  _sum: {
                    gt: actualScore,
                  },
                },
              },
            });

            // Rank starts at 1, array index starts at 0
            const rank = usersWithHigherScores.length + 1;

            currentPlayerPosition = {
              rank,
              pseudo: currentUserInfo.pseudo,
              score: actualScore,
              time: actualTime,
              puzzleCount: actualPuzzleCount,
            };
          }
        }
      }

      // Format response
      const players = Array.from(userMap.values()).map((val, index) => {
        return {
          id: val.user?.id,
          rank: index + 1,
          pseudo: val.user?.pseudo,
          score: val._sum.score || 0,
          time: val._avg.time,
          puzzleCount: val._count.grid_id,
          isCurrentUser: val.user_id === authUserId,
        };
      });

      return reply.send({
        players,
        currentPlayer: currentPlayerPosition,
      });
    } catch (error) {
      return reply.status(500).send({
        clientMessage: "Failed to fetch leaderboard data",
        error,
      });
    }
  };

  return { getLeaderboard };
};
