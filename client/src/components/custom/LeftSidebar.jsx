import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setAuthUser } from "@/redux/auth-slice";
import CreatePost from "./Create-Post";
import { setPosts, setSelectedPost } from "@/redux/post-slice";

const LeftSidebar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>
            {user?.username[0].toUpperCase() || "GN"}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/auth/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        dispatch(setSelectedPost(null));
        navigate("/login");
        toast.success(res.data.msg);
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[20%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">UK INSTA</h1>
        <div>
          {sidebarItems.map((item) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={item.text}
              className="flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-3"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      {open && <CreatePost open={open} setOpen={setOpen} />}
    </div>
  );
};

export default LeftSidebar;
