import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./components/custom/MainLayout";
import { EditProfile, Home, Login, Profile, Register } from "./pages";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home />, index: true },
      { path: "/profile/:id", element: <Profile /> },
      { path: "/account/edit", element: <EditProfile /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={browserRouter} /> ;
    </>
  );
};

export default App;
