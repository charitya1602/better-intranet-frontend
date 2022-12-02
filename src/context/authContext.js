import { createContext, useContext } from "react";

const AUTH_DEFAULT = {
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
}

const authContext = createContext(AUTH_DEFAULT);

const useAuth = () => {
  return useContext(authContext);
}

export { useAuth, authContext };
