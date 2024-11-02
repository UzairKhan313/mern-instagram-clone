import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "../ui/avatar";

import { AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import SuggestedUsers from "./Suggested-Users";

const RightSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.avatar} alt="post_image" />
            <AvatarFallback>GN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-600 text-sm">{user?.bio}</span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
