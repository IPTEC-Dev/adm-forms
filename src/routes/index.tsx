import { createBrowserRouter } from "react-router-dom";
import { Rating } from "../pages/rating";
import { Login } from "../pages/login";
import { ProtectedRouter } from "./privateRouter";
import { Signup } from "../pages/signup";
import { Home } from "../pages/home";
import { Backlog } from "../pages/backlog";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    index: true,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/rating/:id",
    element: <Rating />,
  },
  {
    path: "/home",
    element: <ProtectedRouter route="home" />,
    children: [{ path: "", element: <Home /> }],
  },
  {
    path: "/backlog",
    element: <ProtectedRouter route="backlog" />,
    children: [{ path: "", element: <Backlog /> }],
  },
]);
