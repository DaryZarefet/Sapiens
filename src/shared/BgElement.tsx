import type { IconType } from "react-icons";

interface BgElementProps {
  Icon: IconType;
  title: string;
  widht?: string;
  bgcolor?: string;
}

export const BgElement = (props: BgElementProps) => {
  const { Icon, title, bgcolor, widht } = props;

  return (
    <div className={`flex gap-1 items-center justify-center ${bgcolor} ${widht} rounded-lg p-2 font-bold`}>
      <Icon size={20} className="text-white fill-white" />
      <span className="text-white">{title}</span>
    </div>
  );
};
