import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

import { AppwriteException, ID, Models } from 'appwrite';
import { account } from '@/models/client/config';

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  $id: string;
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;

  login(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  createAccount(
    name: string,
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer(set => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        try {
          const session = await account.getSession('current');
          const user = await account.get<UserPrefs>();
          set({ session, user });
        } catch (error: unknown) {
          console.error('Error verifying session:', error);
        }
      },

      async login(email: string, password: string) {
        try {
          try {
            await account.deleteSession('current');
            console.log('Deleted existing session before new login.');
          } catch (deleteError: unknown) {
            if (
              !(
                deleteError instanceof AppwriteException &&
                deleteError.code === 401
              )
            ) {
              console.warn(
                'Error deleting current session before login:',
                deleteError,
              );
            }
          }
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );
          const [user, { jwt }] = await Promise.all([
            account.get(),
            account.createJWT(),
          ]);

          if (user.prefs && typeof user.prefs.reputation === 'undefined') {
            await account.updatePrefs<UserPrefs>({
              reputation: user.prefs.reputation ?? 0,
            });
          } else if (!user.prefs) {
            await account.updatePrefs<UserPrefs>({ reputation: 0 });
          }

          set({ session, user, jwt });
          return { success: true };
        } catch (error: unknown) {
          console.error(`Error logging in:`, error);
          set({ session: null, user: null, jwt: null });
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          const session = await account.create(
            ID.unique(),
            email,
            password,
            name,
          );

          return {
            success: true,
          };
        } catch (error: unknown) {
          console.error(`Error creating account:`, error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });
        } catch (error: unknown) {
          console.error(`Error logging out:`, error);
        }
      },
    })),
    {
      name: 'auth',
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) {
            state?.setHydrated();
          }
        };
      },
    },
  ),
);
