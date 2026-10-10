import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export const useAdminAccess = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    const checkAccess = async () => {
      try {
        const { data } = await api.get<{ user: { is_platform_admin: boolean } }>("/api/accounts/me/");
        if (!data.user.is_platform_admin) navigate("/auth/admin-login", { replace: true });
      } catch {
        navigate("/auth/admin-login", { replace: true });
      } finally {
        if (active) setChecking(false);
      }
    };
    void checkAccess();
    return () => { active = false; };
  }, [navigate]);

  return checking;
};
