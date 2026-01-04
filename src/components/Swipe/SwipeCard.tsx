// SwipeCard.tsx
import React, { useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { Avatar } from "../Avatar";

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
  post: Post;
  onSwiped: (direction: "left" | "right") => void;
  onCancel?: () => void;
  index?: number; // para stacking visual
}

export default function SwipeCard({ post, onSwiped, index = 0 }: Props) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exiting, setExiting] = useState(false);

  const threshold = 120; // px

  function handlePointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    startY.current = e.clientY;
    startTime.current = Date.now();
    setIsDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (startX.current === null || !isDragging) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current!;
    setTranslate({ x: dx, y: dy });
  }

  function finalizeSwipe(dx: number, dt: number) {
    // opcionalmente podrías usar velocity (dx/dt) para detectar flings
    if (Math.abs(dx) > threshold) {
      const dir = dx > 0 ? "right" : "left";
      // animar fuera de la pantalla
      const toX = dx > 0 ? window.innerWidth : -window.innerWidth;
      setExiting(true);
      setTranslate({ x: toX, y: translate.y });
      // esperar el transition
      setTimeout(() => {
        onSwiped(dir);
      }, 300);
      return true;
    }
    return false;
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (startX.current === null) return;
    const dx = translate.x;
    const dt = startTime.current ? Date.now() - startTime.current : 1;

    setIsDragging(false);
    const did = finalizeSwipe(dx, dt);
    if (!did) {
      // volver al centro
      setTranslate({ x: 0, y: 0 });
    }
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
    startX.current = null;
    startY.current = null;
    startTime.current = null;
  }

  // desktop / keyboard actions
  function triggerSwipe(dir: "left" | "right") {
    if (exiting) return;
    const toX = dir === "right" ? window.innerWidth : -window.innerWidth;
    setExiting(true);
    setTranslate({ x: toX, y: 0 });
    setTimeout(() => onSwiped(dir), 300);
  }

  const rotate = Math.max(-20, Math.min(20, (translate.x / window.innerWidth) * 30));
  const opacityLeft = Math.min(1, Math.max(0, -translate.x / threshold));
  const opacityRight = Math.min(1, Math.max(0, translate.x / threshold));

  // stacking visual small transform based on index
  const stackScale = 1 - Math.min(0.06 * index, 0.18);
  const stackTranslateY = Math.min(12 * index, 36);

  return (
    <div
      className="absolute left-0 right-0 mx-auto max-w-3xl px-4"
      style={{
        transform: `translateY(${stackTranslateY}px) scale(${stackScale})`,
        zIndex: 100 - index,
      }}
    >
      <div
        role="article"
        aria-label={post.title}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-grab select-none`}
        style={{
          transform: `translate3d(${translate.x}px, ${translate.y}px, 0) rotate(${rotate}deg)`,
          transition: isDragging || exiting ? "transform 0.2s linear" : "transform 0.3s ease-out",
          willChange: "transform",
        }}
      >
        {/* visual feedback overlays */}
        <div className="relative">
          {/* image */}
          {post.image && <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />}

          {/* overlays for like / dislike */}
          <div className="absolute inset-0 flex items-start justify-between p-4 pointer-events-none" aria-hidden>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 rounded px-3 py-1 text-white font-semibold"
                style={{
                  background: `rgba(220,38,38, ${Math.min(0.9, opacityLeft)})`,
                  transform: `translateX(${Math.min(0, translate.x)}px)`,
                }}
              >
                <X size={18} />
                <span>No útil</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 rounded px-3 py-1 text-white font-semibold"
                style={{
                  background: `rgba(34,197,94, ${Math.min(0.9, opacityRight)})`,
                  transform: `translateX(${Math.max(0, translate.x)}px)`,
                }}
              >
                <Check size={18} />
                <span>Útil</span>
              </div>
            </div>
          </div>

          {/* content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{post.title}</h3>
            {post.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{post.description}</p>}
            <div className="mt-3 flex items-center gap-3">
              <Avatar user={post.user} size={8} />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <div className="font-medium text-gray-700 dark:text-gray-200">{post.user.name}</div>
                {post.time && <div>{post.time}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* small action buttons for accessibility */}
      <div className="mt-3 flex justify-between gap-2 px-2">
        <button onClick={() => triggerSwipe("left")} className="flex-1 bg-red-600 text-white rounded-md py-2 font-medium hover:bg-red-700" aria-label="No útil">
          No útil
        </button>
        <button
          onClick={() => triggerSwipe("right")}
          className="flex-1 bg-green-600 text-white rounded-md py-2 font-medium hover:bg-green-700"
          aria-label="Útil"
        >
          Útil
        </button>
      </div>
    </div>
  );
}
