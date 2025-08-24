import { computed, ref } from "vue";
import { throwFrontError } from "@/utils/error";
import { Logger } from "./useLogger";
import { useUser } from "./useUser";

const accessToken = ref<string | null>(null);

export const useAuth = () => {
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

  const register = async (payload: {
    email: string;
    password: string;
    pseudo: string;
  }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();
      const message = data.clientMessage;

      if (!response.ok && message) {
        throwFrontError("Failed to register", {
          email: payload.email,
          message,
        });
      }

      const token = response.headers.get("access-token");

      if (token) {
        setAccessToken(token);
        console.debug("✅ Registered");
      }

      setCurrentUser(data.user);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();
      const message = data.clientMessage;

      if (!response.ok && message) {
        throwFrontError("Failed to authenticate", {
          email,
          message,
        });
      }

      const token = response.headers.get("access-token");

      if (token) {
        setAccessToken(token);
        console.debug("✅ Logged in");
      }

      setCurrentUser(data.user);
      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      clearAccessToken();
      setCurrentUser(null);
      console.debug("✅ Logged out");

      return true;
    } catch (error) {
      throwFrontError("Failed to logout", { error });
      return false;
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
          const data = await response.json();

          setAccessToken(accessToken);
          setCurrentUser(data.user);
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
    console.debug("Retrieving session...");
    const accessToken = await refreshToken();

    if (accessToken) {
      console.debug("✅ Session restored");
    } else {
      console.debug("❌ No session found");
    }
  };

  return {
    login,
    isAuthenticated,
    refreshToken,
    getAccessToken,
    logout,
    initializeAuth,
    register,
  };
};
