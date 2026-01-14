import type { User } from "@/types/types";
import type { Option } from "@/types/types";
import { useLocation } from "react-router-dom";
import { MoreOptions } from "../Post/MoreOptions";
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { useFollowStore } from "@/mock/useFollowStore";

//ICONS
import {
  MessageSquare,
  User as UserIcon,
  UserX,
  Flag,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { Avatar } from "../Avatar";

export const ListUser = ({ listuser }: { listuser: User[] }) => {
  const { pathname } = useLocation();

  const follow = useFollowStore((s) => s.follow);
  const unfollow = useFollowStore((s) => s.unfollow);
  const isFollowing = useFollowStore((s) => s.isFollowing);

  const handleSelect = (option: Option) => {
    console.log(option);
  };

  const options = [
    { id: 1, label: "Enviar Mensaje", Icon: MessageSquare },
    { id: 2, label: "Dejar de seguir", Icon: UserMinus },
    { id: 3, label: "Seguir", Icon: UserPlus },
    { id: 4, label: "Ver perfil", Icon: UserIcon },
    { id: 5, label: "Bloquear", Icon: UserX },
    { id: 6, label: "Reportar", Icon: Flag },
  ];

  if (pathname !== "/perfil/siguiendo") {
    options.splice(1, 1);
  }

  if (pathname !== "/perfil/seguidores") {
    options.splice(2, 1);
  }

  return (
    <div className="flex flex-col gap-2">
      {listuser.map((user, id) => {
        const { name, username, role, note, background } = user;

        return (
          <div
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-surface-2 border border-default hover:shadow-md transition-shadow"
            key={id}>
            <div className="flex items-center gap-3">
              <div
                className="rounded-full p-1"
                style={{ background: background ?? "transparent" }}>
                <Avatar user={user} size={12} />
              </div>

              <div className="flex flex-col leading-tight text-left">
                <h3 className="font-bold text-textprimary">{name}</h3>
                {username && (
                  <p className="text-sm text-gray-500">@{username}</p>
                )}
                {note && (
                  <p className="text-sm text-muted mt-1 max-w-md">{note}</p>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                  {role && (
                    <>
                      <div className="bg-gray-400 rounded-full h-1 w-1" />
                      <p>{role.name}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {pathname === "/perfil/siguiendo" ? (
                <ButtonAction
                  type="button"
                  color="danger"
                  className="px-3 py-1 rounded-full text-sm"
                  onClick={() => unfollow(user.id)}>
                  Dejar de seguir
                </ButtonAction>
              ) : (
                <ButtonAction
                  type="button"
                  className="px-3 py-1 rounded-full text-sm"
                  onClick={() => follow(user.id)}>
                  {isFollowing(user.id) ? "Siguiendo" : "Seguir"}
                </ButtonAction>
              )}

              <MoreOptions options={options} onSelect={handleSelect} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
