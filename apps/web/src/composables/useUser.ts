import { computed, ref } from "vue";

type LoggedUser = {
  id: string;
  email: string;
  quality: string;
  role: string;
};

const currentUser = ref<LoggedUser | null>(null);

export const useUser = () => {
  const setCurrentUser = (user: LoggedUser | null) => {
    currentUser.value = user;
  };

  const isAdmin = computed(() => {
    return currentUser.value ? currentUser.value.role === "admin" : false;
  });

  return { currentUser, setCurrentUser, isAdmin };
};
