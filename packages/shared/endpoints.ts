import type { Prisma } from "@prisma/client";
import { DifficultyOptions } from "./utils/sudoku/helper";

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
        backup_wip: number[][];
      };
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
  }>[];
};
