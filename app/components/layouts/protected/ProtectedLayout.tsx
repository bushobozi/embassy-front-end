import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/consular_login", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
}
