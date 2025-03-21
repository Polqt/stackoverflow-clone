import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { AppwriteException, ID, Models } from 'appwrite';
import { account } from '@/models/client/config';

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
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
          if (!useAuthStore.getState().jwt) {
            try {
              const { jwt } = await account.createJWT();
              set({ jwt });
            } catch (jwtError) {
              console.log('Error creating JWT:', jwtError);
            }
          }
        } catch (error) {
          console.log(error);
          set({ session: null, user: null, jwt: null })
        }
      },

      async login(email: string, password: string) {
        try {

          // Make sure to delete all sessions before trying to login
          try {
            await account.deleteSessions()
          } catch (error) {
            console.log('Error deleting sessions:', error)
          }
      
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );

          // Get user data and JWT
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          // Set reputation to 0 if it doesn't exist
          if (!user.prefs?.reputation)
            await account.updatePrefs<UserPrefs>({ reputation: 0 });

          set({ session, user, jwt });
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(email: string, password: string, name: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, user: null, jwt: null });
        } catch (error) {
          console.log(error);
        }
      },
    })),
    {
      name: 'auth',
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    },
  ),
);
