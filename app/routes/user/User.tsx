import { useState, useEffect } from "react";
import type { Route } from "./+types/User";
import { useAuth } from "~/contexts/AuthContext";
import {
  UserProfileHeader,
  ProfileTabs,
  BiographyTab,
  PersonalDetailsTab,
  UserHistoryTab,
} from "~/components";
import type { UserBody } from "./types/UserType";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Profile" },
    { name: "description", content: "My Profile Information" },
  ];
}

export default function User() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserBody | null>(null);
  const [activeTab, setActiveTab] = useState<
    "personal" | "education" | "history"
  >("personal");
  const { user, accessToken, updateUserData } = useAuth();
  const userId = user?.id;
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;
  const USER_URL = `${URL}/users/${userId}`;
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const getUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(USER_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);

      // Update the auth context with the latest profile picture
      if (data.profile_picture) {
        updateUserData({ profile_picture: data.profile_picture });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    setRefreshing(true);
    try {
      await getUserData();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId && token && !userData && !loading) {
      getUserData();
    }
  }, []);

  return (
    <div className="container mx-auto w-full h-full">
      {userData && (
        <>
          <UserProfileHeader
            firstName={userData.first_name}
            middleName={userData.middle_name}
            lastName={userData.last_name}
            role={userData.role}
            department={userData.department}
            refreshUserData={refreshUserData}
            isRefreshing={refreshing}
          />
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "personal" && (
            <PersonalDetailsTab
              UserInfo={userData as any}
              formatDate={formatDate}
              userId={userId!}
              token={token!}
              onUpdateSuccess={refreshUserData}
            />
          )}
          {activeTab === "education" && (
            <BiographyTab
              bio={userData.biography}
              userId={userId!}
              token={token!}
              onUpdateSuccess={refreshUserData}
            />
          )}
          {activeTab === "history" && (
            <UserHistoryTab
              education={userData.education}
              previousEmployers={userData.previous_employers}
              certifications={userData.certifications}
              languages={userData.languages}
              hireDate={userData.hire_date}
              userId={userId!}
              token={token!}
              onUpdateSuccess={refreshUserData}
            />
          )}
        </>
      )}

      {loading && (
        <div className="flex flex-col items-center my-16 gap-2 justify-center h-full w-full">
          <div className="flex w-52 flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
              <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
