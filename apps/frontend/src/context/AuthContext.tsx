'use client';

import authService from '@frontend/services/authService';
import { LoginUserInput } from '@validation/schema/auth.schema';
import { ServerValidationError } from '@validation/schema/response.schema';
import { User } from '@validation/schema/user.schema';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AuthContextState {
  isAuth: boolean;
  user?: User;
  ready: boolean;
  login: (
    input: LoginUserInput['body'],
  ) => Promise<User | ServerValidationError>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextState | undefined>(
  undefined,
);

interface Props {
  children?: ReactNode;
}

const protectedRoutes = ['/pets/create', '/pets/[id]/edit', '/users/me'];

export function AuthContextProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<
    Omit<AuthContextState, 'login' | 'logout'>
  >({
    isAuth: false,
    user: undefined,
    ready: false,
  });

  const isAuth = async () => {
    const result = await authService.isAuth();

    if (result && result.isAuth) {
      const user = await authService.me();
      setState({ isAuth: true, user, ready: true });
    }

    setState({ isAuth: false, user: undefined, ready: true });
    if (protectedRoutes.includes(pathname)) {
      router.push('/auth/login');
    }
  };

  useEffect(() => {
    if (protectedRoutes.includes(pathname)) {
      router.push('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      await isAuth();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (input: LoginUserInput['body']) => {
    const result = await authService.login(input);

    if (result && 'id' in result) {
      setState({ isAuth: true, user: result, ready: true });
      return result;
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setState({ isAuth: false, user: undefined, ready: true });
  };

  const contextState: AuthContextState = useMemo(() => {
    return {
      isAuth: state.isAuth,
      user: state.user,
      ready: state.ready,
      login,
      logout,
    };
  }, [state]);

  return state.ready ? (
    <AuthContext.Provider value={contextState}>{children}</AuthContext.Provider>
  ) : null;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext must be used within an AuthContextProvider',
    );
  }

  return context;
}
