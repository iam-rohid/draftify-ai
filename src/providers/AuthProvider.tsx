import { supabaseClient } from "@/libs/supabaseClient";
import { User } from "@supabase/supabase-js";
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
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

  const fetchUser = useCallback(async () => {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) {
      console.error(error);
    } else {
      setUser(data.user);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
    const {
      data: {
        subscription: { unsubscribe },
      },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return unsubscribe;
  }, [fetchUser]);

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
