import type { Route } from "./+types/ViewPublication";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { BreadCrumb, Button } from "~/components";
import type { PublicationBody } from "./types/publicationBody";
import { FaChevronLeft } from "react-icons/fa6";
import { RiFolderDownloadLine } from "react-icons/ri";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Publication - ${params.publicationId}` },
    { name: "description", content: "Embassy publication details" },
  ];
}

export default function ViewPublication({
  params,
}: {
  params: { publicationId: string };
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicationData, setPublicationData] =
    useState<PublicationBody | null>(null);
  const { accessToken } = useAuth();
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;
  const PUBLICATION_URL = `${URL}/publications/${params.publicationId}`;

  const getPublicationData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(PUBLICATION_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch publication data"
        );
      }

      const data = await response.json();
      setPublicationData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshPublicationData = async () => {
    setRefreshing(true);
    await getPublicationData();
    setRefreshing(false);
  };

  const formatLongDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    getPublicationData();
  }, [params.publicationId]);
  return (
    <div className="container mx-auto w-full h-full my-4">
      <BreadCrumb
        links={[
          { label: "Latest Publications", href: "/home_embassy" },
          { label: "Publications", href: "/em_my_publications" },
          {
            label: publicationData ? publicationData.title : "Loading...",
            href: `/publication_detail_view_id/${params.publicationId}/viewed`,
          },
        ]}
      />
      <div className="flex justify-between items-center mb-6">
        {/* back */}
        <Button variant="outline" size="md" onClick={() => navigate(-1)}>
          <FaChevronLeft className="mr-2" />
          Back
        </Button>
            {publicationData && publicationData.attachments &&
              publicationData.attachments.length > 0 && (
                <div>
                  <ul className="list-disc-none list-inside border border-gray-300 rounded-4xl p-4 bg-white shadow-md w-fit">
                    {publicationData.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a
                          href={attachment}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center px-4 text-xl tooltip tooltip-bottom"
                          data-tip="Download Attachment"
                        >
                          <RiFolderDownloadLine className="inline mr-1" size={20} />
                          Download Attachment
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
        <Button
          variant="outline"
          size="md"
          onClick={refreshPublicationData}
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
      {publicationData && !loading && (
        <>
          {publicationData.cover_image && (
            <div className="mb-8">
              <img
                src={publicationData.cover_image}
                alt={publicationData.title || "Publication cover"}
                className="w-full h-200 object-cover rounded-2xl shadow-none"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {publicationData.title || "Untitled Publication"}
          </h1>
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Published:</span>{" "}
                {formatLongDate(publicationData.created_at)}
              </div>
              {publicationData.updated_at !== publicationData.created_at && (
                <div>
                  <span className="font-semibold">Updated:</span>{" "}
                  {formatLongDate(publicationData.updated_at)}
                </div>
              )}
            </div>
            <div className="flex justify-start items-center gap-3 mt-4">
              <img
                src={
                  publicationData.embassy_picture ||
                  `https://pixabay.com/images/download/x-10022157_1920.jpg`
                }
                alt={publicationData.embassy_name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-500">Created by</p>
                <h1 className="text-2xl text-gray-600">
                  {publicationData.embassy_name}
                </h1>
              </div>
            </div>            
          </div>
          {publicationData.tags && publicationData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {publicationData.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: publicationData.content || "No content available",
            }}
          />
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
