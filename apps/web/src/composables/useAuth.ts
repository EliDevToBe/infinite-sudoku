import { computed, ref } from "vue";
import { throwFrontError } from "@/utils/error";

const accessToken = ref<string | null>(null);

export const useAuth = () => {
  const isAuthenticated = computed(() => {
    return !!accessToken.value;
  });

  const getAccessToken = () => {
    return accessToken.value;
  };

  const setAccessToken = (token: string) => {
    accessToken.value = token;
  };

  const clearAccessToken = () => {
    accessToken.value = null;
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throwFrontError("Failed to authenticate", {
        context: { email, password },
        error: new Error("Failed to authenticate"),
      });
    }

    const token = response.headers.get("access-token");

    console.log("token from login", token);
    if (token) {
      setAccessToken(token);
    }

    const data = await response.json();
    return data;
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (response.ok) {
        const token = response.headers.get("access-token");

        console.log("token from refresh", token);
        if (token) {
          setAccessToken(token);
          return token;
        }
      }

      // CASE: Refresh failed
      clearAccessToken();
      return null;
    } catch (error) {
      clearAccessToken();

      throwFrontError("Failed to refresh token", {
        context: "test context",
        error: error as Error,
      });
      return null;
    }
  };

  return {
    login,
    isAuthenticated,
    refreshToken,
    getAccessToken,
  };
};
