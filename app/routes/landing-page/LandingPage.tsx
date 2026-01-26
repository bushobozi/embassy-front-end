import { Hero, ShowLinks, ExploreUG, FooterBottom, InformationBoardsSection, PublicationsSection } from "./components";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const publicToken = import.meta.env.VITE_PUBLIC_TOKEN;
  const baseURL = import.meta.env.VITE_API_URL;
  const [country, setCountry] = useState("Uganda");
  const LANDING_PAGE_URL = `${baseURL}/information-boards/public/country/${country}`;
  const PUBLICATIONS_URL = `${baseURL}/publications/public/country/${country}`;
  const [boards, setBoards] = useState<any>(null);
  const [publications, setPublications] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [publicationsLoading, setPublicationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicationsError, setPublicationsError] = useState<string | null>(null);

  const fetchLandingPageContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(LANDING_PAGE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": publicToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch landing page content"
        );
      }

      const data = await response.json();
      setBoards(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPublications = async () => {
    setPublicationsLoading(true);
    setPublicationsError(null);

    try {
      const response = await fetch(`${PUBLICATIONS_URL}?page=1&limit=7`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": publicToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch publications"
        );
      }

      const data = await response.json();
      setPublications(data);
    } catch (err) {
      if (err instanceof Error) {
        setPublicationsError(err.message);
      } else {
        setPublicationsError("An unknown error occurred");
      }
    } finally {
      setPublicationsLoading(false);
    }
  };

  useEffect(() => {
    const detectedCountry = new Intl.Locale(navigator.language).region || "Uganda";
    setCountry(detectedCountry);
    fetchLandingPageContent();
    fetchPublications();
  }, []);

  return (
    <>
      <Hero featuredBoards={boards?.data} loadingBoards={loading} />
      <ShowLinks />
      <PublicationsSection publications={publications} loading={publicationsLoading} error={publicationsError} />
      <InformationBoardsSection boards={boards} loading={loading} error={error} />
      <ExploreUG />
      <FooterBottom />
    </>
  );
}
