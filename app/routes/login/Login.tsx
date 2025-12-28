import type { Route } from "./+types/Login";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components";
import { useAuth } from "~/contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Embassy Login Page" },
  ];
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const URL = import.meta.env.VITE_API_URL;
  const LOGIN_URL = `${URL}/auth/login`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      setError("Please fill in all required fields. *Email and Password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store user data and tokens in cookies via auth context
      login(data.user, data.access_token, data.refresh_token);

      // Redirect to dashboard
      navigate("/home_embassy");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main>
      <div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div>
            <div className="my-3">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="enter your email"
                className="input mt-2 w-full"
              />
            </div>
            <div className="my-3">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="enter your password"
                className="input mt-2 w-full"
              />
            </div>
            <div className="my-3">
              <Button
                type="submit"
                className="mt-1"
                block={true}
                size="md"
                color="primary"
                disabled={loading}
              >
                {loading ? (<span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>) : "Sign In"}
              </Button>
            </div>
            {error ? (
              <p
                className="mt-4 text-center text-sm text-red-600 alert alert-error alert-soft"
                role="alert"
              >
                {error}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </main>
  );
}
