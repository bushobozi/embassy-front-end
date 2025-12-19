import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HeroLayout } from "./hero/hero-layout";
import { Ug } from "~/images";
import { FaSearch } from "react-icons/fa";
import data from "../data/data.json";
import SearchDialog from "./search-dialog";

type LinkItem = {
  name: string;
  url: string;
  description?: string;
};

export default function Hero() {
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [results, setResults] = useState<LinkItem[]>([]);
  const navigate = useNavigate();

  // helper: flatten items from data.json
  const flattenLinks = (): LinkItem[] => {
    const ministries: any[] = (data as any).ministries || [];
    const out: LinkItem[] = [];
    ministries.forEach((m) => {
      if (m && Array.isArray(m.items)) {
        m.items.forEach((it: any) =>
          out.push({ name: it.name, url: it.url, description: it.description })
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
    if (!q) return;

    const all = flattenLinks();
    const ql = q.toLowerCase();
    const matched = all.filter(
      (it) =>
        it.name.toLowerCase().includes(ql) ||
        (it.description || "").toLowerCase().includes(ql)
    );

    setResults(matched);

    try {
      dialogRef.current?.showModal();
    } catch {
      // fallback: set open attribute if showModal not supported
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
        <h1 className="text-8xl font-bold">
          Welcome to Uganda Government Services
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
          <p className="font-bold text-xl">Search</p>
          <div className="relative flex w-full max-w-2xl pt-3 pb-6">
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
      </HeroLayout>
    </>
  );
}
