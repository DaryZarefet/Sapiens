// INTERFACES
import type { Post, Comment } from "@/types/types";

// ICONS
import { Eye, MessageCircle, ThumbsUp, ThumbsDown, type LucideIcon } from "lucide-react";

type Props = {
  stats: Post | Comment;
};

type InteractButtonProps = {
  Icon: LucideIcon;
  value?: number;
  hovercolor?: string;
  onClick: () => void;
};

const InteractButton = ({ Icon, value, onClick }: InteractButtonProps) => {
  return (
    <button type="button" onClick={onClick} className="rounded-md flex items-center gap-1  hover:bg-surface ">
      <Icon size={18} className={`text-muted transform transition-all duration-150 hover:scale-125 hover:stroke-blue-400`} />
      <p className="text-sm">{value ?? 0}</p>
    </button>
  );
};

// COMPONENTE STATS
export const Stats = ({ stats }: Props) => {
  const { views, messages, likes, dislikes } = stats;

  return (
    <div className="flex justify-between items-center pt-2">
      <div className="flex items-center gap-6 text-muted">
        <InteractButton Icon={Eye} value={views} onClick={() => console.log("views")} />
        <InteractButton Icon={MessageCircle} value={messages} onClick={() => console.log("messages")} />
      </div>

      <div className="flex items-center gap-4 text-muted">
        <InteractButton Icon={ThumbsUp} value={likes} onClick={() => console.log("likes")} />
        <InteractButton Icon={ThumbsDown} value={dislikes} onClick={() => console.log("dislikes")} />
      </div>
    </div>
  );
};
