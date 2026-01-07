/*
"id": "d28359e8-b95a-4b61-8ec2-77d4abf09493",
    "name": "Main Embassy",
    "country": "Uganda",
    "city": "Kampala",
    "address": "Main Street, Kampala",
    "phone": "+256-XXX-XXXXXX",
    "email": "main@embassy.gov",
    "embassy_picture": null,
    "is_active": true,
    "created_at": "2026-01-04T12:26:30.566Z",
    "updated_at": "2026-01-04T12:26:30.566Z"
*/ 

import { useAuth } from "~/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface Embassy {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  embassy_picture: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function EmbassyList(){
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [embassies, setEmbassies] = useState<Embassy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const token = accessToken;
    const URL = import.meta.env.VITE_API_URL;
    const EMBASSIES_URL = `${URL}/embassy`;
    const selectedEmbassyId = searchParams.get("embassyId");

    const handleEmbassyClick = (embassyId: string) => {
        navigate(`/home_embassy?embassyId=${embassyId}`);
      };

    const getEmbassies = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(EMBASSIES_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to fetch embassies data"
            );
          }
    
          const data = await response.json();
          setEmbassies(data);
        } catch (err: any) {
          console.error("Error fetching embassies:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
      };

      useEffect(() => {
        getEmbassies();
      }, []);
      return(
        <div className="my-3">
            {loading && (
            <div className="skeleton h-32 w-full"></div>
          )}
          {error && (
            <p className="text-sm text-red-600">Error loading embassies</p>
          )}
          {embassies && embassies.length > 0 ? (
            <ul className="space-y-2">
              {embassies.map((embassy: Embassy) => {
                const isSelected = selectedEmbassyId === embassy.id;
                return (
                  <li key={embassy.id}>
                    <button
                      onClick={() => handleEmbassyClick(embassy.id)}
                      className={`w-full text-left rounded-3xl transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-yellow-300 border-0 hover:bg-red-300/50 transition-colors"
                          : "bg-yellow-100 hover:bg-yellow-100/50 transition-colors hover:border-yellow-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {embassy.embassy_picture ? (
                          <img
                            src={`${embassy.embassy_picture}`}
                            alt={embassy.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-300"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center border-2 border-yellow-300">
                            <span className="text-lg font-bold text-gray-700">
                              {embassy.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900">
                            {embassy.name}
                          </h3>
                          {(embassy.city || embassy.country) && (
                            <p className="text-xs text-gray-600">
                              {[embassy.city, embassy.country]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            !loading && (
              <p className="text-sm text-gray-600">No embassies found</p>
            )
          )}
        </div>
      )
}