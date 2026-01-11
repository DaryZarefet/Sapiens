import avatardefault from "@/assets/images/avatar.png";

//TYPES
import type { User } from "@/types/types";

export const Avatar = ({
  user,
  size = 10,
}: {
  user: User | null;
  size?: number;
}) => {
  // Validación con optional chaining para evitar errores si user es null
  const name = user?.name || "Usuario";
  const avatar = user?.avatar;

  return avatar ? (
    <img
      src={avatar}
      alt={name}
      className={`rounded-full object-cover w-${size} h-${size}`}
    />
  ) : (
    <div
      className={`rounded-full bg-gray-300 flex items-center justify-center font-semibold text-sm select-none w-${size} h-${size}`}
      aria-hidden
    >
      <img
        src={avatardefault}
        alt={name}
        className={`rounded-full object-cover w-${size} h-${size}`}
      />
    </div>
  );
};
