import type { Prisma } from "@prisma/client";
import { ResetPasswordInput } from "../../apps/api/src/controllers/auth.controller";
import { ForgotPasswordBody } from "../../apps/api/src/services/email.interface";
import { Cell, DifficultyOptions } from "./utils/sudoku/helper";

type Endpoint = {
  path: `/${string}`;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string>;
  body?: Record<string, unknown>;
};

type ValidateEndpoint<T extends Endpoint> = T;

export type ApiEndpoint = ValidateEndpoint<
  | {
      path: "/user";
      method: "GET";
    }
  | {
      path: "/user/:id";
      method: "GET";
      params: {
        id: string;
      };
    }
  | {
      path: "/grid";
      method: "GET";
    }
  | {
      path: "/grid/:id";
      method: "GET";
      params: {
        id: string;
      };
    }
  | {
      path: "/grid/difficulty/:difficulty";
      method: "GET";
      params: {
        difficulty: DifficultyOptions;
      };
    }
  | {
      path: "/user-grid";
      method: "POST";
      body: {
        user_id: string;
        grid_id: string;
        backup_wip: Cell[][];
      };
    }
  | {
      path: "/user-grid/:id";
      method: "PUT";
      params: {
        id: string;
      };
      body: {
        finished_at: string;
        backup_wip: null;
        score: number;
      };
    }
  | {
      path: "/user-grid/user/:id";
      method: "GET";
      params: {
        id: string;
      };
    }
  | {
      path: "/user-grid/delete/:id/:userId";
      method: "DELETE";
      params: {
        id: string;
        userId: string;
      };
    }
  | {
      path: "/leaderboard/:period";
      method: "GET";
      params: {
        period: "daily" | "weekly" | "monthly";
      };
    }
  | {
      path: "/email/forgot-password";
      method: "POST";
      body: ForgotPasswordBody;
    }
  | {
      path: "/auth/reset-password";
      method: "POST";
      body: ResetPasswordInput;
    }
  | {
      path: "/auth/confirm-email";
      method: "POST";
      body: { token: string };
    }
>;

export type EndpointResponse = {
  "/user": Prisma.userGetPayload<true>[];
  "/user/:id": Prisma.userGetPayload<true>;
  "/grid": Prisma.gridGetPayload<true>[];
  "/grid/:id": Prisma.gridGetPayload<true>;
  "/grid/difficulty/:difficulty": Prisma.gridGetPayload<{
    select: {
      id: true;
      difficulty: true;
      puzzle: true;
    };
  }>;
  "/user-grid": Prisma.user_gridGetPayload<{
    select: {
      id: true;
    };
  }>;
  "/user-grid/user/:id": {
    id: string;
    difficulty: DifficultyOptions;
    hardSave: Cell[][];
    time: number;
  }[];
  "/user-grid/delete/:id/:userId": {
    clientMessage: string;
  };
  "/user-grid/:id": Prisma.user_gridGetPayload<{
    select: {
      id: true;
    };
  }>;
  "/leaderboard/:period": {
    players: Array<{
      id: string;
      pseudo: string;
      score: number;
      time: number;
      puzzleCount: number;
      isCurrentUser: boolean;
    }>;
    currentPlayer?: {
      rank: number;
      pseudo: string;
      score: number;
      time: number;
      puzzleCount: number;
    };
  };
  "/email/forgot-password": { clientMessage: "Email sent successfully" };
  "/auth/reset-password": {
    email: string;
  };
  "/auth/confirm-email": {
    success: boolean;
  };
};
