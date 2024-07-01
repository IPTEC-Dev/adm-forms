import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouterProps {
  route: "home" | "backlog";
}

export function ProtectedRouter({ route }: ProtectedRouterProps) {
  const token = localStorage.getItem("token");
  const isAdm = localStorage.getItem("adm") === "true";

  if (!token) {
    return <Navigate to="/" />;
  }

  if (route === "home" && isAdm) {
    return <Navigate to="/backlog" />;
  }

  if (route === "backlog" && !isAdm) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
}
