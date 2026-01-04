import { Outlet } from "react-router-dom";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { MainHeader } from "./Headers/MainHeader";
import { MobileHeader } from "./Headers/MobileHeader";
import { ScrollToTop } from "./ScrollToTop";

const Layout = ({ sidebarBreakpoint = 1024 }) => {
  const isDesktop = useIsDesktop(sidebarBreakpoint);

  return (
    <div className="bg-white text-textprimary">
      <ScrollToTop />
      {isDesktop ? <MainHeader /> : <MobileHeader />}

      <main className="flex items-center justify-center ">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

// py-5 px-5 lg:px-10 xl:px-20
