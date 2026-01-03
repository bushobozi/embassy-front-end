import { useState, useEffect } from "react";
import type { Route } from "./+types/StaffList";
import { useAuth } from "~/contexts/AuthContext";
import type {
  StaffList,
  StaffListResponse,
} from "../types/Staff-List/GetStaff";
import { defaultStaffListResponse } from "../types/Staff-List/GetStaff";
import { Banner, Button } from "~/components";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Embassy Staff Lists" },
    { name: "description", content: "Embassy Staff List" },
  ];
}

export default function StaffList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staffList, setStaffList] = useState<StaffList[]>([]);
  const [staffListResponse, setStaffListResponse] =
    useState<StaffListResponse | null>(null);
  const { accessToken, user } = useAuth();
  const embassyId = user?.embassy_id;
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;
  // http://localhost:3000/api/v1/staff
  const STAFF_LIST_URL = `${URL}/staff`;
  const genderOptions = ["male", "female", "other"];
  const maritalStatus = ["single", "married", "divorced", "widowed", "other"];
  const religionOptions = [
    "Christianity",
    "Islam",
    "Hinduism",
    "Buddhism",
    "Judaism",
    "Other",
  ];
  const staffStatus = ["active", "inactive", "on_leave", "retired"];
  const [gender, setGender] = useState("");
  const [marital_status, setMarital_status] = useState("");
  const [religion, setReligion] = useState("");
  const [staff_status, setStaff_status] = useState("");
  const limit = 25;
  const [page, setPage] = useState(1);
  const fetchStaffList = async () => {
    if (!embassyId) {
      console.log("No embassy ID available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        embassy_id: embassyId,
        limit: limit.toString(),
        page: page.toString(),
      });

      if (gender) params.append("gender", gender);
      if (marital_status) params.append("marital_status", marital_status);
      if (religion) params.append("religion", religion);
      if (staff_status) params.append("staff_status", staff_status);

      const url = `${STAFF_LIST_URL}?${params.toString()}`;
      console.log("Fetching staff list:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to fetch staff list");
      }

      const data: StaffListResponse = await response.json();
      setStaffList(data.data);
      setStaffListResponse(data);
    } catch (err) {
      console.error("Fetch error:", err);
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
    if (embassyId) {
      fetchStaffList();
    }
  }, [embassyId, page, gender, marital_status, religion, staff_status]);

  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (
      staffListResponse &&
      staffListResponse.meta.page < staffListResponse.meta.totalPages
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const showPagination =
    staffListResponse &&
    staffListResponse.meta.limit >= 25 &&
    staffListResponse.meta.totalPages > 1;

  const goToStaffProfile = (staffId: string) => {
    navigate(`/embassy_staff_profile/${staffId}/page`);
  };
  return (
    <div className="h-full">
      <div className="w-full">
        <Banner>Embassy Staff List</Banner>
      </div>
      <div className="w-full grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
        <div>
          <label htmlFor="gender" className="label mb-3">
            Select Gender
          </label>
          <select
            id="gender"
            className="select select-bordered w-full max-w-xs"
            value={gender}
            onChange={(e) => handleFilterChange(setGender, e.target.value)}
          >
            <option value="">All Genders</option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="marital_status" className="label mb-3">
            Select Marital Status
          </label>
          <select
            id="marital_status"
            className="select select-bordered w-full max-w-xs"
            value={marital_status}
            onChange={(e) =>
              handleFilterChange(setMarital_status, e.target.value)
            }
          >
            <option value="">All Marital Status</option>
            {maritalStatus.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="religion" className="label mb-3">
            Select Religion
          </label>
          <select
            id="religion"
            className="select select-bordered w-full max-w-xs"
            value={religion}
            onChange={(e) => handleFilterChange(setReligion, e.target.value)}
          >
            <option value="">All Religions</option>
            {religionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="staff_status" className="label mb-3">
            Select Staff Status
          </label>
          <select
            id="staff_status"
            className="select select-bordered w-full max-w-xs"
            value={staff_status}
            onChange={(e) =>
              handleFilterChange(setStaff_status, e.target.value)
            }
          >
            <option value="">All Staff Status</option>
            {staffStatus.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() +
                  option.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      {staffList.length === 0 && !loading && !error && (
        <div className="w-full text-center text-gray-600 my-16 bg-gray-200 p-6 rounded-xl">
          No staff found for the selected filters.
        </div>
      )}
      {staffList.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table border border-gray-200">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Department</th>
                <th>Gender</th>
                {/* <th>Nationality</th>
                <th>Country</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length > 0 ? (
                staffList.map((staff, index) => (
                  <tr key={staff.id} className="hover">
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>
                      <div className="flex gap-3 items-center tooltip tooltip-success tooltip-right cursor-pointer" onClick={() => goToStaffProfile(staff.id)}
                        data-tip={`View ${staff.first_name} ${staff.last_name} Profile`}>
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={
                                staff.photo ||
                                "https://img.daisyui.com/images/profile/demo/2@94.webp"
                              }
                              alt={`${staff.first_name} ${staff.last_name}`}
                            />
                          </div>
                        </div>
                        <div className="font-bold">
                          {staff.first_name} {staff.middle_name ? ` ${staff.middle_name} ` : " "} {staff.last_name}
                        </div>
                      </div>
                    </td>
                    <td>{staff.email}</td>
                    <td>{staff.phone}</td>
                    <td>{staff.position}</td>
                    <td>{staff.department}</td>
                    <td>
                      <span className="capitalize">{staff.gender}</span>
                    </td>
                    {/* <td>{staff.nationality}</td>
                    <td>{staff.country}</td> */}
                    <td>
                      <Button variant="outline" size="sm" className="cursor-pointer tooltip tooltip-success tooltip-left" onClick={() => goToStaffProfile(staff.id)}
                        data-tip={`View ${staff.first_name} ${staff.last_name} Profile`}
                        >View</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={15} className="text-center py-8">
                    {loading ? "Loading..." : "No staff members found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {showPagination && (
        <div className="flex justify-between items-center w-full sm:w-2/3 lg:w-3/4 mt-6">
          <div className="text-sm text-gray-600">
            Showing page {staffListResponse?.meta.page} of{" "}
            {staffListResponse?.meta.totalPages} (Total:{" "}
            {staffListResponse?.meta.total} staff)
          </div>
          <div className="join">
            <button
              className="join-item btn"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              « Previous
            </button>
            <button className="join-item btn">Page {page}</button>
            <button
              className="join-item btn"
              onClick={handleNextPage}
              disabled={
                !staffListResponse || page >= staffListResponse.meta.totalPages
              }
            >
              Next »
            </button>
          </div>
        </div>
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
        <div className="w-full sm:w-2/3 lg:w-3/4 bg-red-100 text-red-800 p-4 rounded mb-4">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
