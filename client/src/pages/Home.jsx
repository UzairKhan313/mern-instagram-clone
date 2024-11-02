import { Outlet } from "react-router-dom";

import Feed from "@/components/custom/Feed";
import RightSidebar from "@/components/custom/Right-Sidebar";

const Home = () => {
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
