import { authClient } from "@/libs/fireabseClient";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AuthContext = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isError: boolean;
  error: unknown;
};

export const authContext = createContext<AuthContext | null>(null);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const isLoggedIn = useMemo(() => !isLoading && !!user, [user, isLoading]);
  const isError = useMemo(() => error !== null, [error]);

  useEffect(() => {
    return onAuthStateChanged(
      authClient,
      (user) => {
        setUser(user);
        if (isLoading) {
          setIsLoading(false);
        }
      },
      (error) => {
        setError(error);
        if (isLoading) {
          setIsLoading(false);
        }
      }
    );
  }, [isLoading]);

  return (
    <authContext.Provider
      value={{ user, isLoading, isLoggedIn, error, isError }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw "useAuth must use inside AuthContext";
  return context;
};
