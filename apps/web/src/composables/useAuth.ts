import { computed, ref } from "vue";
import { throwFrontError } from "@/utils/error";
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
      throwFrontError(message, {
        email: payload.email,
      });
    }

    const token = response.headers.get("access-token");

    if (token) {
      setAccessToken(token);
      console.debug("✅ Registered");
    }

    setCurrentUser(data.user);
    return true;
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

    const data = await response.json();
    const message = data.clientMessage;

    if (!response.ok && response.status === 404) {
      throwFrontError("No account found", {
        email,
      });
    }

    if (!response.ok && response.status === 401) {
      throwFrontError("Invalid credentials", {
        email,
      });
    }

    if (!response.ok && message) {
      throwFrontError("Failed to login", {
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
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    clearAccessToken();
    setCurrentUser(null);
    console.debug("✅ Logged out");

    return true;
  };

  const refreshToken = async () => {
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
  };

  const initializeAuth = async () => {
    console.debug("Retrieving session...");
    const accessToken = await refreshToken();

    if (accessToken) {
      console.debug("✅ Session restored");
      return true;
    }

    console.debug("❌ No session found");
    return false;
  };

  const resetPassword = async (email: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/email/forgot-password`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    const message = data.clientMessage;

    if (!response.ok && message) {
      throwFrontError(message, {
        email,
      });
    }

    return true;
  };

  return {
    login,
    isAuthenticated,
    refreshToken,
    getAccessToken,
    logout,
    initializeAuth,
    register,
    resetPassword,
  };
};
