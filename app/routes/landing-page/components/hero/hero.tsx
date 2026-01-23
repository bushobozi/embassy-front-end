import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { HeroLayout } from "./hero-layout";
import { Ug } from "~/images";
import { FaSearch } from "react-icons/fa";
import data from "../../data/data.json";
import SearchDialog from "./search-dialog";
import { BsChevronRight } from "react-icons/bs";

type LinkItem = {
  name: string;
  url: string;
  description?: string;
};

interface FeaturedBoard {
  id?: string;
  title: string;
  description: string;
  image?: string;
  attachments?: string[];
  embassy?: {
    name: string;
    city: string;
    country: string;
  };
}

interface HeroProps {
  featuredBoards?: FeaturedBoard[];
  loadingBoards?: boolean;
}

export default function Hero({
  featuredBoards = [],
  loadingBoards = false,
}: HeroProps) {
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [results, setResults] = useState<LinkItem[]>([]);
  const navigate = useNavigate();
  const flattenLinks = (): LinkItem[] => {
    const ministries: any[] = (data as any).ministries || [];
    const out: LinkItem[] = [];
    ministries.forEach((m) => {
      if (m && Array.isArray(m.items)) {
        m.items.forEach((it: any) =>
          out.push({ name: it.name, url: it.url, description: it.description }),
        );
      } else if (m && m.url && m.name) {
        out.push({ name: m.name, url: m.url, description: m.description });
      }
    });
    return out;
  };
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      alert("Please enter a search term.");
      return;
    }
    const all = flattenLinks();
    const ql = q.toLowerCase();
    const matched = all.filter(
      (it) =>
        it.name.toLowerCase().includes(ql) ||
        (it.description || "").toLowerCase().includes(ql),
    );
    setResults(matched);
    try {
      dialogRef.current?.showModal();
    } catch {
      if (dialogRef.current) dialogRef.current.setAttribute("open", "true");
    }
  }
  const closeDialog = () => {
    if (!dialogRef.current) return;
    try {
      dialogRef.current.close();
    } catch {
      dialogRef.current.removeAttribute("open");
    }
  };

  return (
    <>
      <HeroLayout>
        <h1 className="text-5xl lg:text-8xl font-bold">
          Welcome to Uganda Consulate Services
        </h1>

        <img src={Ug} alt="Uganda Flag" className="mt-6 h-auto w-full" />

        <p className="mt-4 text-3xl">
          Access a wide range of services and information provided by the
          government.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full"
          role="search"
          aria-label="Search services"
        >
          <label htmlFor="hero-search" className="sr-only">
            Search government services
          </label>
          {/* <p className="font-bold text-xl">Search</p> */}
          <div className="relative flex w-full max-w-full pt-3 pb-6">
            <input
              id="hero-search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search links..."
              className="w-full border-2 border-red-700 px-4 py-4 text-lg focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center bg-red-700 px-4 py-4 text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <FaSearch className="mr-2 text-2xl" />
            </button>
          </div>
        </form>

        {/* use the modular SearchDialog component */}
        <SearchDialog
          ref={dialogRef}
          results={results}
          query={query}
          onClose={closeDialog}
        />

        {/* Featured Information Boards */}
        {loadingBoards ? (
          <div className="mt-8 w-full">
            <h3 className="text-4xl font-bold mb-4">Information Board</h3>
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          </div>
        ) : featuredBoards.length > 0 ? (
          <div className="mt-4 w-full">
            <div
              id="boards-heading"
              className="flex flex-wrap lg:flex-nowrap justify-between items-start lg:items-center mb-12 gap-4"
            >
              <h3 className="text-4xl font-bold">Information Boards</h3>

              <a
                href="#boards-heading"
                className="inline-flex items-center justify-center bg-white px-4 py-4
               w-full md:w-auto text-center text-xl rounded-4xl
               text-gray-900 hover:underline transition font-medium"
              >
                View all boards
                <BsChevronRight className="ml-2" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-4 gap-8">
              {featuredBoards.slice(0, 3).map((board) => (
                <div
                  key={board.id || board.title}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  {board.image && (
                    <img
                      src={board.image}
                      alt={board.title}
                      className="w-full h-60 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">
                      {board.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {board.description}
                    </p>
                  </div>
                  {board.attachments && board.attachments.length > 0 && (
                    <div className="flex items-center justify-center text-center font-bold text-white mt-auto bg-red-600 py-6 px-4 rounded-t-2xl">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <a
                        href={board.attachments[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        download
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </HeroLayout>
    </>
  );
}
