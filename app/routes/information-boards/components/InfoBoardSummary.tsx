import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { StatsCard, Loader } from "~/components";

interface InfoBoardStats {
    totalBoards: number;
    activeBoards: number;
    inactiveBoards: number;
}

interface InfoBoardSummaryProps {
    refreshKey?: number;
}

export default function InfoBoardSummary({ refreshKey }: InfoBoardSummaryProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<InfoBoardStats | null>(null);
    const { accessToken, user} = useAuth();
    const token = accessToken;
    const embassyId = user?.embassy_id;
    const URL = import.meta.env.VITE_API_URL;
    const STATSURL = `${URL}/information-boards/stats/summary?embassy_id=${embassyId}`;

    const fetchStats = async () => {
        if (!token) return;
        if (!embassyId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(STATSURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch information board stats");
            }
            const data = await response.json();
            setStats(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [embassyId, token, refreshKey]);
  return (
    <div>
      <h1 className="my-4 text-2xl font-bold text-blue-900">Information Boards Summary</h1>
     { loading ? (
        <Loader />
     ) : error ? (
        <p className="text-red-500">Error: {error}</p>
     ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4 mb-6">
            <StatsCard title="Total Boards" value={stats.totalBoards} />
            <StatsCard title="Active Boards" value={stats.activeBoards} />
            <StatsCard title="Inactive Boards" value={stats.inactiveBoards} />
        </div>
     ) : null }
    </div>
  );
}