import { User, UserRole } from '../../types';

export interface AuthState {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  token: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  token: null,
};
