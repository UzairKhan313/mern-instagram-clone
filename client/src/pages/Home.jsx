import { Outlet } from "react-router-dom";

import Feed from "@/components/custom/Feed";
import RightSidebar from "@/components/custom/Right-Sidebar";
import useGetAllPost from "@/hooks/use-Get-All-Post";
import useGetSuggestedUsers from "@/hooks/use-Get-Suggested-User";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
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
