import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/home";
import { Login } from "../pages/login";
import { ProtectedRouter } from "./privateRouter";
import { Signup } from "../pages/signup";

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
    path: "/home",
    element: <ProtectedRouter />,
    children: [{ path: "", element: <Home /> }],
  },
]);
