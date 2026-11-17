export * from './slices/authSlice';
export * from './slices/themeSlice';

export interface RootState {
  auth: import('./slices/authSlice').AuthState;
  theme: import('./slices/themeSlice').ThemeState;
}
