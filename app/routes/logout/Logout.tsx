import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import { Coat } from "~/images";
import { Button } from "~/components";

export default function Logout() {
  const { logout, accessToken, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/consular_login", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const URL = import.meta.env.VITE_API_URL;
  const LOGOUT_URL = `${URL}/auth/logout`;

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (accessToken) {
        await fetch(LOGOUT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      logout();
      setLoading(false);
      navigate("/consular_login", { replace: true });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return(
    <div className="grid place-content-center h-screen w-screen bg-gray-700">
      <div className="relative mx-auto w-full lg:w-[60vw] max-w-md bg-white px-6 pt-10 pb-8 shadow-sm ring-1 ring-gray-900/5 rounded-xl lg:rounded-2xl sm:px-10">
        <div className="w-full">
          <img src={Coat} alt="Coat of Arms of Uganda" className="w-20 h-20 mx-auto" />
          <p className="my-6 text-gray-500 text-sm">
            You are about to log out. If you are experiencing any issues, please <a
              href="#!"
              className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"
            >Contact Admin
            </a>
          </p>
          <div className="flex flex-col space-y-4 mt-4">
            <Button variant="primary" className="cursor-pointer" block={true} onClick={() => {handleLogout() }} disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </span>
              ) : "Log out"}
            </Button>
            {/* Cancel logout */}
            <Button variant="outline" className="cursor-pointer" block={true} onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
