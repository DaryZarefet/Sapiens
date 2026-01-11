import type { Comment, User } from "@/types/types";

export const commentService = {
  // Simula crear un comentario con los datos necesarios
  createComment: (content: string, currentUser: User): Comment => {
    return {
      id: Date.now(), // Usamos el timestamp como ID temporal
      content,
      replies: [],
      user: currentUser,
      time: new Date().toISOString(),
      likes: 0,
      views: 0,
      messages: 0,
    };
  },
};
