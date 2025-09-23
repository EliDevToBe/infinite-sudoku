import type { ApiEndpoint, EndpointResponse } from "@shared/endpoints";
import { throwFrontError } from "@/utils/error";
import { useAuth } from "./useAuth";

export const useApi = () => {
  const { getAccessToken, refreshToken } = useAuth();

  const buildFetchOptions = (
    endpoint: ApiEndpoint,
    token: string | null,
    signal?: AbortSignal,
  ): RequestInit => {
    const { method } = endpoint;
    const body = "body" in endpoint ? endpoint.body : undefined;

    const headers = new Headers();

    if (token) {
      headers.append("access-token", token);
    }

    const options: RequestInit = {
      method,
      credentials: "include",
      headers,
      signal,
    };

    if (body && method !== "GET") {
      headers.set("Content-Type", "application/json");
      options.body = JSON.stringify(body);
    }

    return options;
  };

  const buildUrl = (endpoint: ApiEndpoint, baseUrl: string): string => {
    const { path } = endpoint;
    const params = "params" in endpoint ? endpoint.params : undefined;

    let finalPath = path as string;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        finalPath = finalPath.replace(`:${key}`, value as string);
      });
    }

    return `${baseUrl}${finalPath}`;
  };

  const fetchApi = async <T extends ApiEndpoint>(
    payload: T,
  ): Promise<{
    data: EndpointResponse[T["path"]] | null;
    error: Error | null;
  }> => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      throwFrontError("API_URL is not defined", {
        endpoint: payload,
      });
    }

    const url = buildUrl(payload, apiUrl);

    const signal =
      "signal" in payload ? (payload.signal as AbortSignal) : undefined;

    const makeRequest = async (token: string | null) => {
      const options = buildFetchOptions(payload, token, signal);
      return fetch(url, options);
    };

    try {
      /*
        1. Make initial request with access token
        2. If 401, try to refresh token and make request again
        3. If refresh fails, it's handled by the method
       */
      let response = await makeRequest(getAccessToken());

      if (response.status === 401) {
        const newToken = await refreshToken();

        if (!newToken) {
          return { data: null, error: new Error("Failed to refresh token") };
        }

        response = await makeRequest(newToken);
      }

      const data = await response.json();

      if (!response.ok && data.clientMessage) {
        return { data: null, error: new Error(data.clientMessage) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  return { fetchApi };
};
