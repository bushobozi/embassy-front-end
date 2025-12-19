import { Coat } from "~/images";
import { Link } from "react-router";

export default function FooterBottom() {
  return (
    <div className="relative">
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10">
        <img src={Coat} alt="Coat of Arms of Uganda" className="w-28 h-28" />
      </div>
      <footer className="bg-gray-950 text-white py-4 px-3 mt-16">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full md:w-1/2 md:text-center md:mb-0 mb-8">
            <p className="text-xs text-gray-400 md:text-sm">
              Copyright 2020 &copy; All Rights Reserved - The Republic of Uganda
            </p>
          </div>
          <div className="w-full md:w-1/2 md:text-center md:mb-0 mb-8">
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm border-b mx-2"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm border-b mx-2"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm border-b mx-2"
            >
              LinkedIn
            </a>
            <Link
              to="consular-panel-login"
              target="_blank"
              className="text-gray-400 hover:text-white text-sm border-b mx-2"
            >
              Embassy/Consular Staff Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
