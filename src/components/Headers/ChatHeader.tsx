import { Avatar } from "../Avatar";
import { HeaderDiv } from "./HeaderDiv";

export const ChatHeader = ({ otherUser }: { otherUser: any }) => {
  return (
    <HeaderDiv>
      <Avatar user={otherUser} size={10} />
      <div className="flex-1">
        <div className="font-medium">{otherUser.name}</div>
        <div className="text-xs text-slate-500">En línea</div>
      </div>
      <div className="flex gap-2">
        <button aria-label="Información" className="p-2 rounded-md hover:bg-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 12a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
        </button>
      </div>
    </HeaderDiv>
  );
};
