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

      const top20Grids = await prisma.user_grid.findMany({
        where: {
          finished_at: {
            gte: startDate,
            lte: now,
          },
          score: {
            not: null,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              pseudo: true,
            },
          },
        },
        orderBy: {
          score: "desc",
        },
        take: 20, // Limit 20
      });

      // Get current user's position if not in top 20
      let currentPlayerPosition = null;
      const currentUserInTop20 = top20Grids.find(
        (topGrid) => topGrid.user_id === authUserId,
      );

      if (!currentUserInTop20) {
        const currentUserGrid = await prisma.user_grid.findFirst({
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
          include: {
            user: {
              select: {
                id: true,
                pseudo: true,
              },
            },
          },
          orderBy: {
            score: "desc",
          },
        });

        if (currentUserGrid && currentUserGrid.score !== null) {
          // Calculate actual rank
          const rank =
            (await prisma.user_grid.count({
              where: {
                finished_at: {
                  gte: startDate,
                  lte: now,
                },
                score: {
                  gt: currentUserGrid.score,
                },
              },
            })) + 1;

          currentPlayerPosition = {
            rank,
            pseudo: currentUserGrid.user.pseudo,
            score: currentUserGrid.score,
            time: currentUserGrid.time || 0,
          };
        }
      }

      // Format response
      const players = top20Grids.map((ug) => ({
        id: ug.user.id,
        pseudo: ug.user.pseudo,
        score: ug.score || 0,
        time: ug.time || 0,
        isCurrentUser: ug.user_id === authUserId,
      }));

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
