import { useState, useEffect } from "react";
import type { Route } from "./+types/StaffProfile";
import { useAuth } from "~/contexts/AuthContext";
import { BreadCrumb, Button } from "~/components";
import Qualifications from "./components/Qualifications";
import PersonalInformation from "./components/PersonalInformation";
import EmergencyContacts from "./components/EmergencyContacts";
import ProfilePicture from "./components/ProfilePicture";
import StaffStatus from "./components/StaffStatus";
import type { StaffBody } from "../types/staff-body/StaffBody";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Staff Profile - ${params.staffId}` },
    { name: "description", content: "Staff Profile Information" },
  ];
}

export default function StaffProfile({
  params,
}: {
  params: { staffId: string };
}) {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staffData, setStaffData] = useState<StaffBody | null>(null);
  const { accessToken } = useAuth();
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;
  const STAFF_URL = `${URL}/staff/${params.staffId}`;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStaffData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(STAFF_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch staff data");
      }

      const data = await response.json();
      setStaffData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshStaffData = async () => {
    setRefreshing(true);
    try {
      await getStaffData();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token && !staffData && !loading) {
      getStaffData();
    }
  }, []);

  const getStaffFullName = () => {
    if (!staffData) return "Staff Profile";
    const middleName = staffData.middle_name ? ` ${staffData.middle_name}` : "";
    return `${staffData.first_name}${middleName} ${staffData.last_name}`;
  };

  return (
    <div className="container mx-auto w-full h-full">
      <BreadCrumb
        links={[
          { label: "Embassy Staff Overview", href: "/embassy_staff" },
          { label: "Embassy Staff List", href: "/embassy_staff_list" },
          { label: staffData ? getStaffFullName() : "loading..." },
        ]}
      />

      {staffData && (
        <>
          {/* Staff Profile Header */}
          <div className="backdrop-blur-sm mb-6 sticky top-10 z-10 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {getStaffFullName()}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {staffData.position || "No Position"} •{" "}
                  {staffData.department || "No Department"}
                </p>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={refreshStaffData}
                disabled={refreshing}
              >
                 {refreshing ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Refreshing...
            </>
          ) : (
            "Refresh"
          )}
              </Button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Picture and Status */}
            <div className="lg:col-span-1 space-y-6">
              <ProfilePicture
                photo={staffData.photo}
                staffId={params.staffId}
                token={token!}
                onUpdateSuccess={refreshStaffData}
              />
              <StaffStatus
                staffStatus={staffData.staff_status}
                hireDate={staffData.hire_date}
                isTransferred={staffData.is_transfered}
                transferDate={staffData.transfer_date}
                transferReason={staffData.transfer_reason}
                staffId={params.staffId}
                token={token!}
                onUpdateSuccess={refreshStaffData}
                formatDate={formatDate}
              />
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              <PersonalInformation
                staffInfo={staffData}
                staffId={params.staffId}
                token={token!}
                onUpdateSuccess={refreshStaffData}
                formatDate={formatDate}
              />
              <Qualifications
                academicQualifications={staffData.academic_qualifications}
                professionalQualifications={staffData.professional_qualifications}
                skills={staffData.skills}
                languages={staffData.languages}
                staffId={params.staffId}
                token={token!}
                onUpdateSuccess={refreshStaffData}
              />
              <EmergencyContacts
                emergencyContactName={staffData.emergency_contact_name}
                emergencyContactRelationship={
                  staffData.emergency_contact_relationship
                }
                emergencyContactPhone={staffData.emergency_contact_phone}
                nextOfKinName={staffData.next_of_kin_name}
                nextOfKinRelationship={staffData.next_of_kin_relationship}
                nextOfKinPhone={staffData.next_of_kin_phone}
                staffId={params.staffId}
                token={token!}
                onUpdateSuccess={refreshStaffData}
              />
            </div>
          </div>
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
