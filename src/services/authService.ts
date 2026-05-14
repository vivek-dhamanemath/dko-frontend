import { supabase } from "@/src/lib/supabase";
import { api } from "@/src/lib/api";

export interface User {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    lifetimeResourcesCount: number;
}

export const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
};

export const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    if (error) throw new Error(error.message);
    return data;
};

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    if (error) throw new Error(error.message);
    return data;
};

export const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    if (error) throw new Error(error.message);
    return data;
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
};

export const getMe = async (): Promise<User> => {
    const response = await api.get<User>("/user/me");
    return response.data;
};

export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};
