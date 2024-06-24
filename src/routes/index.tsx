import { createBrowserRouter } from "react-router-dom";
import { Rating } from "../pages/rating";
import { Login } from "../pages/login";
import { ProtectedRouter } from "./privateRouter";
import { Signup } from "../pages/signup";
import { Home } from "../pages/home";

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
    path: "/rating",
    element: <Rating />,
  },
  {
    path: "/home",
    element: <ProtectedRouter />,
    children: [{ path: "", element: <Home /> }],
  },
]);
