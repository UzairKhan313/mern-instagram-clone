import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home, Login, Profile, Register } from "./pages";
import MainLayout from "./components/custom/MainLayout";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home />, index: true },
      { path: "/profile/:id", element: <Profile /> },
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
