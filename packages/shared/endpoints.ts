import type { Prisma } from "@prisma/client";

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
>;

export type EndpointResponse = {
  "/user": Prisma.userGetPayload<true>[];
  "/user/:id": Prisma.userGetPayload<true>;
  "/grid": Prisma.gridGetPayload<true>[];
  "/grid/:id": Prisma.gridGetPayload<true>;
};
