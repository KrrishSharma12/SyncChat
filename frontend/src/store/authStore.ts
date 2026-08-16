import { create } from "zustand";
import { persist } from "zustand/middleware";


interface User {
    id: string;
    username: string;
    email: string;
    profile: string | null;
}


interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setUser: (user: User | null) => void;
    setIsAuthenticated: (value: boolean) => void;
    setCurrentUser: (user: User) => void;
    setIsLoading: (value: boolean) => void;
    logout: () => void;
}



export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({

            user: null,
            isAuthenticated: false,
            isLoading: false,


            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),



            setIsAuthenticated: (value) =>
                set({
                    isAuthenticated: value,
                }),



            setIsLoading: (value) =>
                set({
                    isLoading: value,
                }),

            setCurrentUser: (user: User) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),

            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                }),

        }),

        {
            name: "auth-storage",
        }

    )
);