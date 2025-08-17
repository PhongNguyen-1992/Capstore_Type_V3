import { create } from "zustand";
import type { CurrentUser } from "../interfaces/auth.interface";
// Giá trị Defaut của User là null. Có thể thay bằng localStorge
const userLocal = localStorage.getItem("user");
const parsedUser: CurrentUser | null = userLocal ? JSON.parse(userLocal) : null;
// type cho User
type AuthStore = {
  user: CurrentUser | null;
  setUser: (user: CurrentUser) => void;
  clearUser: () => void;
};
export const userAuthStore = create<AuthStore>((set) => ({
  user: parsedUser, // Gán giá trị ban đầu
  setUser: (user: CurrentUser) => set({ user }), // thêm user
  clearUser: () => {
    set({ user: null }), localStorage.removeItem("user");
  }, // clear user
}));
