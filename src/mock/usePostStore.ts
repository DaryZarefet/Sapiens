import { create } from "zustand";
import type { Post } from "@/types/types";
import { examplePosts } from "@/mock/mockpublic";

type PostState = {
  posts: Post[];
  fetchPosts: () => Post[];
  createPost: (p: Omit<Post, 'id' | 'time' | 'views' | 'messages' | 'likes'>) => Post;
  updatePost: (id: number, patch: Partial<Post>) => Post | undefined;
  deletePost: (id: number) => void;
};

let _nextId = examplePosts.reduce((max, p) => Math.max(max, p.id ?? 0), 0) + 1;

export const usePostStore = create<PostState>((set, get) => ({
  posts: [...examplePosts],
  fetchPosts: () => {
    return get().posts;
  },

  createPost: (payload) => {
    const newPost: Post = {
      id: _nextId++,
      title: payload.title,
      description: payload.description,
      time: new Date().toISOString(),
      categories: payload.categories ?? [],
      views: 0,
      messages: 0,
      likes: 0,
      user: payload.user,
      institution: payload.institution,
      type: payload.type,
    };
    set((s) => ({ posts: [newPost, ...s.posts] }));
    return newPost;
  },

  updatePost: (id, patch) => {
    let updated: Post | undefined;
    set((s) => ({
      posts: s.posts.map((p) => {
        if (p.id === id) {
          updated = { ...p, ...patch };
          return updated;
        }
        return p;
      }),
    }));
    return updated;
  },

  deletePost: (id) => {
    set((s) => ({ posts: s.posts.filter((p) => p.id !== id) }));
  },
}));
