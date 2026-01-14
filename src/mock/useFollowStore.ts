import { create } from "zustand";
import type { User } from "@/types/types";
import { userlist } from "@/mock/mockusers";

type FollowState = {
  followers: User[];
  following: User[];
  follow: (id: number) => void;
  unfollow: (id: number) => void;
  isFollowing: (id: number) => boolean;
};

export const useFollowStore = create<FollowState>((set, get) => ({
  followers: [...userlist],
  following: [],
  follow: (id: number) => {
    const exists = get().following.find((u) => u.id === id);
    if (exists) return;
    const user = get().followers.find((u) => u.id === id) || userlist.find((u) => u.id === id);
    if (!user) return;
    set((s) => ({ following: [user, ...s.following] }));
  },
  unfollow: (id: number) => {
    set((s) => ({ following: s.following.filter((u) => u.id !== id) }));
  },
  isFollowing: (id: number) => {
    return get().following.some((u) => u.id === id);
  },
}));
