import { ref } from "vue";

type LoggedUser = {
  id: string;
  email: string;
  quality: string;
  role: string;
};

export const useUser = () => {
  const currentUser = ref<LoggedUser | null>(null);

  const setCurrentUser = (user: LoggedUser | null) => {
    currentUser.value = user;
  };

  return { currentUser, setCurrentUser };
};
