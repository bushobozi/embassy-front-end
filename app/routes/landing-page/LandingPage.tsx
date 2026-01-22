import { Hero, ShowLinks, ExploreUG, FooterBottom, InformationBoardsSection } from "./components";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const publicToken = import.meta.env.VITE_PUBLIC_TOKEN;
  const baseURL = import.meta.env.VITE_API_URL;
  const [country, setCountry] = useState("Uganda");
  const LANDING_PAGE_URL = `${baseURL}/information-boards/public/country/${country}`;
  const [boards, setBoards] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const detectedCountry = new Intl.Locale(navigator.language).region || "Uganda";
    setCountry(detectedCountry);
    fetchLandingPageContent();
  }, []);

  return (
    <>
      <Hero featuredBoards={boards?.data} loadingBoards={loading} />
      <ShowLinks />
      <InformationBoardsSection boards={boards} loading={loading} error={error} />
      <ExploreUG />
      <FooterBottom />
    </>
  );
}
