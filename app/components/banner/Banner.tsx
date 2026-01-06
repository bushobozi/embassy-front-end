import { useState, useEffect } from "react";
import { Coat } from "~/images";
import { useAuth } from "~/contexts/AuthContext";


type BannerProps = {
  children: React.ReactNode;
};

interface embassy {
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
}

const embassyData: embassy = {
  name: 'Embassy Name',
  country: 'USA',
  city: 'New York',
  address: 'Main St, 123',
  phone: '+2568888888'
}

export default function Banner({ children }: BannerProps) {
  const [loading, setLoading] = useState(false);
  const [embassy, setEmbassy] = useState<embassy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, user } = useAuth();
  const embassyId = user?.embassy_id;
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;
  const EMBASSY_URL = `${URL}/embassy/${embassyId}`;

  const fetchEmbassyData = async () => {
    if (!embassyId) {
      setError("Embassy ID not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(EMBASSY_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch embassy data");
      }

      const data = await response.json();
      setEmbassy(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmbassyData();
  }, [embassyId]);
  return (
    <div className="bg-blue-200 text-white p-8 rounded-b-2xl mb-6 shadow-0 transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-blue-800">
            {loading ? "loading..." : embassy ? `${embassy.name} - ${embassy.address}, ${embassy.city} ${embassy.country}` : "Embassy Information Unavailable"}<br />
            {loading ? "loading..." : embassy ? `${embassy.phone}` : "Embassy Phone Number"}
          </h2>
      <h1 className="mt-2 text-2xl font-bold text-blue-900">
        {children}
      </h1>
        </div>
        <div>
          <img src={Coat} alt="Coat of Arms" className="h-12 ml-4" />
        </div>
      </div>
    </div>
  );
}
