import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";

import MainLayout from "./components/custom/MainLayout";
import { setSocket } from "./redux/socket-slice";
import { setOnlineUsers } from "./redux/chat-slice";
import { setLikeNotification } from "./redux/notification-slice";
import { Chat, EditProfile, Home, Login, Profile, Register } from "./pages";
import ProtectedRoutes from "./components/custom/Protect-Routes";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "/", element: <Home />, index: true },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <Chat />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socketio);

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:3000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} /> ;
    </>
  );
};

export default App;
