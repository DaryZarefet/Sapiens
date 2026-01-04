import { useState } from "react";
import SwipeCard from "./SwipeCard";

// types.ts
export type User = {
  id: number;
  name: string;
  avatar?: string;
};

export type Post = {
  id: number;
  title: string;
  description?: string;
  image?: string;
  time?: string;
  user: User;
};

interface Props {
  posts: Post[];
  onSwipe?: (post: Post, direction: "left" | "right") => void;
  maxStack?: number; // cuántas tarjetas en display
}

export default function SwipeDeck({ posts, onSwipe, maxStack = 3 }: Props) {
  const [index, setIndex] = useState(0); // índice de la tarjeta superior

  function handleSwiped(direction: "left" | "right") {
    const post = posts[index];
    onSwipe?.(post, direction);
    setIndex((i) => i + 1);
  }

  if (index >= posts.length) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">No hay más publicaciones</div>
      </div>
    );
  }

  // mostrar solo las siguientes `maxStack` tarjetas
  const stack = posts.slice(index, index + maxStack);

  return (
    <div className="relative h-[700px] max-w-3xl mx-auto">
      {stack
        .map((post, i) => <SwipeCard key={post.id} post={post} index={i} onSwiped={(dir) => handleSwiped(dir)} />)
        // renderizar la última primero para stack visual correcta
        .reverse()}
    </div>
  );
}
