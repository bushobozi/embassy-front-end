// login layout
import { Outlet } from "react-router";
import Welcome from "./Welcome";

export default function LoginLayout() {
  return (
    <div className="grid place-content-center h-screen w-screen bg-gray-50">
      <div className="relative mx-auto w-full lg:w-[60vw] max-w-md bg-white px-6 pt-10 pb-8 shadow-sm ring-1 ring-gray-900/5 rounded-xl lg:rounded-2xl sm:px-10">
        <div className="w-full">
          <Welcome />
          {<Outlet />}
          <p className="mt-2 text-gray-500 text-sm">
            Sign in below to access your account. Don&#x27;t have an account yet?
            <a
              href="#!"
              className="font-semibold mx-2 text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"
            >
              Contact Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
