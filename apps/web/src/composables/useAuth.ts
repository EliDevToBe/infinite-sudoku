import { createSharedComposable } from "@vueuse/core";
import { computed, ref } from "vue";
import { throwFrontError } from "@/utils/error";
import { useUser } from "./useUser";

const accessToken = ref<string | null>(null);

export const useAuth = createSharedComposable(() => {
  const { setCurrentUser } = useUser();

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
        context: { email },
        error: new Error("Failed to authenticate"),
      });
    }

    const token = response.headers.get("access-token");

    console.log("token from login", token);
    if (token) {
      setAccessToken(token);
    }

    const data = await response.json();
    setCurrentUser(data.user);
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      clearAccessToken();
      setCurrentUser(null);

      console.log("accessToken after logout", accessToken.value);
      console.log("isAuthenticated after logout", isAuthenticated.value);
    }
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
        const accessToken = response.headers.get("access-token");

        if (accessToken) {
          setAccessToken(accessToken);
          return accessToken;
        }
      }

      // CASE: Refresh failed
      clearAccessToken();
      return null;
    } catch (error) {
      console.error("Failed to refresh token", error);
      clearAccessToken();

      return null;
    }
  };

  const initializeAuth = async () => {
    try {
      console.debug("Initializing session...");
      const accessToken = await refreshToken();

      if (accessToken) {
        console.log("✅ Session restored");
      } else {
        console.log("❌ No session found");
      }
    } catch (error) {
      console.log("❌ Failed to initialize session:", error);
    }
  };

  return {
    login,
    isAuthenticated,
    refreshToken,
    getAccessToken,
    logout,
    initializeAuth,
  };
});
