import type { ApiEndpoint } from "@shared/endpoints";
import { useAuth } from "./useAuth";

export const useApi = () => {
  const { getAccessToken, refreshToken } = useAuth();

  const fetchApi = async (payload: ApiEndpoint) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      throw new Error("API_URL is not defined");
    }

    const { path, ...params } = payload;

    const makeRequest = async (token: string | null) => {
      return fetch(`${apiUrl}${path}`, {
        ...params,
        credentials: "include",
        headers: {
          ...(token && { "access-token": token }),
        },
      });
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
        response = await makeRequest(newToken);
      }

      const data = await response.json();

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  };

  return { fetchApi };
};
