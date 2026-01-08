import { Button, ManagePublicationCard } from "~/components";
import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import { apolloClient } from "~/apolloClient";
import { GET_EMBASSY_PUBLICATIONS } from "../components/graphql";
import type {
  Publication as BasePublication,
  PublicationQueryResponse,
} from "~/components/publications/embassy-publications/EmbassyPublications";

interface Publication extends BasePublication {
  deletePublication?: (publicationId: string) => Promise<void>;
  draftPublication?: (publicationId: string) => Promise<void>;
  archivePublication?: (publicationId: string) => Promise<void>;
  publishPublication?: (publicationId: string) => Promise<void>;
}
import {
  PUBLICATION_TAGS,
  ITEMS_PER_PAGE,
} from "~/components/publications/embassy-publications/EmbassyPublications";

interface Toast {
  id: string;
  type: 'confirm' | 'undo' | 'success' | 'error';
  title: string;
  message: string;
  action?: 'publish' | 'archive' | 'draft' | 'delete';
  publicationId?: string;
  countdown?: number;
}

interface CreatedPublicationsProps {
  onStatsChange?: () => void;
}

export default function CreatedPublications({ onStatsChange }: CreatedPublicationsProps) {
  const { user, accessToken } = useAuth();
  const token = accessToken;
  const embassyId = user?.embassy_id;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, string>>({});
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const displayedPublications = publications.slice(0, displayCount);
  const hasMoreData = displayCount < publications.length;
  const URL = import.meta.env.VITE_API_URL;
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };
  const fetchPublications = async () => {
    if (!embassyId) {
      setError("Embassy ID not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const variables = {
        embassy_id: embassyId,
        page: 1,
        limit: 25,
        // status: "published",
      };
      const result = await apolloClient.query<PublicationQueryResponse>({
        query: GET_EMBASSY_PUBLICATIONS,
        variables,
        fetchPolicy: "network-only",
      });

      if (result.data?.publications) {
        const mappedPublications: Publication[] = result.data.publications.map(
          (pub: any) => ({
            id: pub.id,
            title: pub.title,
            cover: pub.cover_image || "",
            tag: pub.publication_type || "GENERAL",
            type: pub.publication_type || "article",
            content: pub.content,
            created_at: pub.created_at,
            updated_at: pub.updated_at,
            created_by: {
              id: 0,
              name: pub.created_by || "Unknown",
              profile_picture: "",
            },
            views: 0,
            embassy: {
              id: 0,
              name: pub.embassy_name || "",
              picture: pub.embassy_picture || "",
            },
          })
        );
        setPublications(mappedPublications);
      } else {
        console.log("No publications in response");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch publications"
      );
    } finally {
      setLoading(false);
    }
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showConfirmToast = (action: Toast['action'], publicationId: string, publicationTitle: string) => {
    const messages = {
      publish: { title: 'Publish Publication?', message: `Are you sure you want to publish "${publicationTitle}"?` },
      archive: { title: 'Archive Publication?', message: `Are you sure you want to archive "${publicationTitle}"?` },
      draft: { title: 'Move to Draft?', message: `Are you sure you want to move "${publicationTitle}" to draft?` },
      delete: { title: 'Delete Publication?', message: `Are you sure you want to delete "${publicationTitle}"?` },
    };
    
    const msg = messages[action!];
    addToast({
      type: 'confirm',
      title: msg.title,
      message: msg.message,
      action,
      publicationId,
    });
  };

  const publishPublication = async (publicationId: string) => {
    if (!publicationId) return;
    const publication = publications.find(p => p.id.toString() === publicationId);
    showConfirmToast('publish', publicationId, publication?.title || 'this publication');
  };

  const executePublish = async (publicationId: string) => {
    if (!publicationId) return;
    setLoadingStates(prev => ({ ...prev, [publicationId]: 'publishing' }));
    setError(null);

    const PUBLISHURL = `${URL}/publications/${publicationId}/publish`;
    try {
      const response = await fetch(PUBLISHURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to publish publication");
      }
      addToast({
        type: 'success',
        title: 'Published Successfully',
        message: 'The publication has been published.',
      });
      refreshPublications();
      onStatsChange?.();
    } catch (error) {
      console.error("Error publishing publication:", error);
      addToast({
        type: 'error',
        title: 'Publish Failed',
        message: error instanceof Error ? error.message : "Failed to publish publication",
      });
    } finally {
      setLoadingStates(prev => {
        const newStates = { ...prev };
        delete newStates[publicationId];
        return newStates;
      });
    }
  };

  const archivePublication = async (publicationId: string) => {
    if (!publicationId) return;
    const publication = publications.find(p => p.id.toString() === publicationId);
    showConfirmToast('archive', publicationId, publication?.title || 'this publication');
  };

  const executeArchive = async (publicationId: string) => {
    if (!publicationId) return;
    setLoadingStates(prev => ({ ...prev, [publicationId]: 'archiving' }));
    setError(null);
    const ARCHIVEURL = `${URL}/publications/${publicationId}/archive`;
    try {
      const response = await fetch(ARCHIVEURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to archive publication");
      }
      addToast({
        type: 'success',
        title: 'Archived Successfully',
        message: 'The publication has been archived.',
      });
      refreshPublications();
      onStatsChange?.();
    } catch (error) {
      console.error("Error archiving publication:", error);
      addToast({
        type: 'error',
        title: 'Archive Failed',
        message: error instanceof Error ? error.message : "Failed to archive publication",
      });
    } finally {
      setLoadingStates(prev => {
        const newStates = { ...prev };
        delete newStates[publicationId];
        return newStates;
      });
    }
  };

  const draftPublication = async (publicationId: string) => {
    if (!publicationId) return;
    const publication = publications.find(p => p.id.toString() === publicationId);
    showConfirmToast('draft', publicationId, publication?.title || 'this publication');
  };

  const executeDraft = async (publicationId: string) => {
    if (!publicationId) return;
    setLoadingStates(prev => ({ ...prev, [publicationId]: 'drafting' }));
    setError(null);
    const DRAFTURL = `${URL}/publications/${publicationId}/draft`;
    try {
      const response = await fetch(DRAFTURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to move publication to draft");
      }
      addToast({
        type: 'success',
        title: 'Moved to Draft',
        message: 'The publication has been moved to draft.',
      });
      refreshPublications();
      onStatsChange?.();
    } catch (error) {
      console.error("Error moving publication to draft:", error);
      addToast({
        type: 'error',
        title: 'Draft Failed',
        message: error instanceof Error ? error.message : "Failed to move publication to draft",
      });
    } finally {
      setLoadingStates(prev => {
        const newStates = { ...prev };
        delete newStates[publicationId];
        return newStates;
      });
    }
  };

  const deletePublication = async (publicationId: string) => {
    if (!publicationId) return;
    const publication = publications.find(p => p.id.toString() === publicationId);
    showConfirmToast('delete', publicationId, publication?.title || 'this publication');
  };

  const startDeleteCountdown = (publicationId: string) => {
    let countdown = 53;
    const toastId = addToast({
      type: 'undo',
      title: 'Deleting Publication',
      message: `Publication will be deleted in ${countdown} seconds. Click Undo to cancel.`,
      publicationId,
      countdown,
    });

    countdownIntervalRef.current = setInterval(() => {
      countdown -= 1;
      setToasts(prev => prev.map(t => 
        t.id === toastId ? { ...t, countdown, message: `Publication will be deleted in ${countdown} seconds. Click Undo to cancel.` } : t
      ));
    }, 1000);

    deleteTimerRef.current = setTimeout(() => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      executeDelete(publicationId);
      removeToast(toastId);
    }, 53000);
  };

  const undoDelete = (publicationId: string) => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setToasts(prev => prev.filter(t => t.publicationId !== publicationId));
    addToast({
      type: 'success',
      title: 'Deletion Cancelled',
      message: 'The publication was not deleted.',
    });
  };

  const executeDelete = async (publicationId: string) => {
    if (!publicationId) return;
    setLoadingStates(prev => ({ ...prev, [publicationId]: 'deleting' }));
    setError(null);
    const DELETEURL = `${URL}/publications/${publicationId}`;
    try {
      const response = await fetch(DELETEURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete publication");
      }
      addToast({
        type: 'success',
        title: 'Deleted Successfully',
        message: 'The publication has been deleted.',
      });
      refreshPublications();
      onStatsChange?.();
    } catch (error) {
      console.error("Error deleting publication:", error);
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : "Failed to delete publication",
      });
    } finally {
      setLoadingStates(prev => {
        const newStates = { ...prev };
        delete newStates[publicationId];
        return newStates;
      });
    }
  };

  const refreshPublications = async () => {
    setRefreshing(true);
    try {
      await fetchPublications();
    } finally {
      setRefreshing(false);
    }
  };

  const handleConfirmAction = (action: Toast['action'], publicationId: string, toastId: string) => {
    removeToast(toastId);
    if (action === 'publish') executePublish(publicationId);
    else if (action === 'archive') executeArchive(publicationId);
    else if (action === 'draft') executeDraft(publicationId);
    else if (action === 'delete') startDeleteCountdown(publicationId);
  };

  useEffect(() => {
    fetchPublications();
  }, [embassyId]);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  return (
    <div className="w-full pb-8 pt-0">
      {/* Toast Container */}
      <div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-1/3 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-500/30 transition-all duration-300 ease-out animate-in slide-in-from-right"
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900" style={{ marginBottom: '0rem' }}>
                    {toast.title}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">{toast.message}</p>
                  <div className="mt-4 flex gap-2">
                    {toast.type === 'confirm' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleConfirmAction(toast.action!, toast.publicationId!, toast.id)}
                          className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => removeToast(toast.id)}
                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {toast.type === 'undo' && (
                      <>
                        <button
                          type="button"
                          onClick={() => undoDelete(toast.publicationId!)}
                          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          Undo ({toast.countdown}s)
                        </button>
                      </>
                    )}
                    {(toast.type === 'success' || toast.type === 'error') && (
                      <button
                        type="button"
                        onClick={() => removeToast(toast.id)}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 inline-flex text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="my-4 text-2xl font-bold text-blue-900">
          Manage News Updates and Publications
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={refreshPublications}
            className="cursor-pointer tooltip tooltip-left"
            data-tip="Refresh publications list"
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
      <div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        {loading && (
          <div className="grid place-content-center h-full">
            <div className="flex w-52 flex-col gap-4">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          </div>
        )}
        {!loading && displayedPublications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No publications found for this filter.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
              {displayedPublications.map((pub) => (
                <article
                  key={pub.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-sm transition-shadow duration-300 tooltip tooltip-bottom"
                  data-tip={pub.title}
                >
                  <ManagePublicationCard
                    {...pub}
                    deletePublication={deletePublication}
                    draftPublication={draftPublication}
                    archivePublication={archivePublication}
                    publishPublication={publishPublication}
                    loadingState={loadingStates[pub.id.toString()]}
                  />
                </article>
              ))}
            </div>
            {hasMoreData && (
              <div className="flex justify-center mt-12 mb-4">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleLoadMore}
                  className="min-w-50 px-8 py-3"
                >
                  Load More Publications
                </Button>
              </div>
            )}
            {!hasMoreData && displayedPublications.length > 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">
                You've reached the end of the publications list
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
