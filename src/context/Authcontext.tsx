import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { LoginUserInput } from "@/type/users/LoginUserInput";
import { AuthorizedUser } from "@/type/users/AuthorizedUser";
import axiosInstance from "@/utils/axios";
import { mockAPIRequest } from "@/api/mockAPI";
// import { createSession, deleteSession } from "@/api/session";

interface AuthContextType {
  user: AuthorizedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: LoginUserInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps ) => {
  const [user, setUser] = useState<AuthorizedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthorized = async () => {
      try {
        // const response = await axiosInstance.get<AuthorizedUser>("users")
        const response = await mockAPIRequest("/users")
        console.log(response.data)
        setUser(response.data)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAuthorized();
  }, []);

  const createSession = async (data: LoginUserInput) => {
    // const response = await axiosInstance.post<AuthorizedUser>("session", { user: data })
    const response = await mockAPIRequest("/session", { user: data })
    return response
  }

  const deleteSession = async () => {
    // const response = await axiosInstance.delete("session")
    const response = await mockAPIRequest("/delete_session")
    return response
  }

  const login = async (data: LoginUserInput) => {
    try {
      const response = await createSession(data)
      setUser(response.data)
    } catch {
      throw new Error("ログインに失敗しました");
    }
  };

  const logout = async () => {
    const response = await deleteSession()
    if (response.status === 200) {
      setUser(null);
    } else {
      alert("再度お試しください")
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context;
};
