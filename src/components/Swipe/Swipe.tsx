// ExamplePage.tsx
import SwipeDeck from "./SwipeDeck";

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

const examplePosts: Post[] = [
  {
    id: 1,
    title: "Paper: New Techniques in ML",
    description: "Resumen de métodos y datasets recomendados.",
    image: "https://picsum.photos/seed/1/800/400",
    time: "2025-11-01",
    user: { id: 1, name: "A. Researcher", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  },
  {
    id: 2,
    title: "Documentación: Cómo reproducir experimentos",
    description: "Checklist y plantillas para la reproducibilidad.",
    image: "https://picsum.photos/seed/2/800/400",
    time: "2025-10-28",
    user: { id: 2, name: "B. Scientist", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  },
  {
    id: 3,
    title: "Estudio de caso: Evaluación de métricas",
    description: "Comparación práctica de métricas en NLP.",
    image: "https://picsum.photos/seed/3/800/400",
    time: "2025-10-25",
    user: { id: 3, name: "C. Analyst", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  },
];

export default function ExamplePage() {
  function handleSwipe(post: Post, dir: "left" | "right") {
    console.log("swiped", dir, post.id);
    // Aquí puedes:
    // - enviar fetch/axios a tu API para registrar preferencia
    // - almacenar localmente para procesar en lote
    // - mostrar un snackbar de confirmación
  }

  return (
    <div className="p-4 bg-gray-100  ">
      <h2 className="text-xl font-semibold mb-4">Explorar investigación</h2>
      <SwipeDeck posts={examplePosts} onSwipe={handleSwipe} />
    </div>
  );
}
