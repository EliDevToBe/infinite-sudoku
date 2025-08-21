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
    }
>;
