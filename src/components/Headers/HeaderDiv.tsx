// import { useIsDesktop } from "@/shared/ui/useIsDesktop";

export const HeaderDiv = ({ children }: { children: React.ReactNode }) => {
  // const isDesktop = useIsDesktop(1024);

  return (
    // <header className={`${isDesktop && "ml-80"} bg-primary flex-none sticky top-0 left-0 right-0 text-textprimary z-40 border-b border-gray-600`}>
    <header className="bg-primary flex-none sticky top-0 left-0 right-0 text-textprimary z-40 border-b border-gray-600">{children}</header>
  );
};
