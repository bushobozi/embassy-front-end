import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Banner, Button } from "~/components";
import { useAuth } from "~/contexts/AuthContext";
import { StatsCard } from "~/components";
import { RiArrowLeftSLine } from "react-icons/ri";
import CreatedPublications from "./CreatedPublications";
import type { Route } from "./+types/ManagePublications";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Manage Publications - Embassy Dashboard" },
    { name: "description", content: "Embassy manage publications dashboard" },
  ];
}

export interface PublicationStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  byType: {
    [key: string]: number;
  };
}

export default function ManagePublications() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PublicationStats | null>(null);
  const { accessToken, user } = useAuth();
  const token = accessToken;
  const embassyId = user?.embassy_id;
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;
  const STATSURL = `${URL}/publications/stats/summary?embassy_id=${embassyId}`;

  const getStats = async () => {
    if (!embassyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${STATSURL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch publication stats"
        );
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      console.error("Error fetching publication stats:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, [embassyId]);
  return (
    <div>
      <Banner>
        Manage News Update - Publish, Archive, Draft, Update and Delete
      </Banner>
      <div className="my-4">
        <div className="flex justify-between">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="cursor-pointer"
              size="md"
              onClick={() => navigate(-1)}
            >
              <RiArrowLeftSLine className="inline mr-1" size={16} />
              Back
            </Button>
            <Button
              variant="outline"
              size="md"
              className="cursor-pointer"
              onClick={() => navigate("/em_my_publications")}
            >
              My Publications
            </Button>
          </div>
          <Button
            variant="secondary"
            size="md"
            className="ml-4 cursor-pointer"
            onClick={() => navigate("/publications_write")}
          >
            Create New Publication
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="grid place-content-center h-full my-4">
          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
            <StatsCard title="Total" value={stats.total} />
            <StatsCard title="Published" value={stats.published} />
            <StatsCard title="Drafts" value={stats.draft} />
            <StatsCard title="Archived" value={stats.archived} />
            {Object.entries(stats.byType).map(([type, count]) => (
              <StatsCard
                key={type}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                value={count}
              />
            ))}
          </div>
        </>
      ) : (
        <div>No statistics available.</div>
      )}
      <div>
        <CreatedPublications onStatsChange={getStats} />
      </div>
    </div>
  );
}
