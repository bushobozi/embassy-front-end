import { useState, useEffect, useRef } from "react";
import { Button } from "~/components";
import CreateBoardModal from "~/components/modals/CreateBoardModal";
import EditBoardModal from "~/components/modals/EditBoardModal";
import { apolloClient } from "~/apolloClient";
import { useAuth } from "~/contexts/AuthContext";
import { GET_INFORMATION_BOARDS } from "./graphql";

export interface Board {
  id?: string;
  title: string;
  category: string;
  embassy_id: string;
  image?: string;
  attachments?: string[];
  description: string;
  is_active: boolean;
  location: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface InformationBoardsQueryResult {
  informationBoards: Board[];
}

interface BoardCardProps extends Board {
  onEdit: () => void;
  onDelete: () => void;
}

export function BoardCard({ onEdit, onDelete, ...board }: BoardCardProps) {
  return (
    <div className="flex gap-4 bg-white border border-gray-300 rounded-3xl overflow-hidden items-center justify-start max-w-full hover:shadow-sm transition-shadow">
      {board.image ? (
        <div className="relative w-32 h-full flex-1">
          <img
            className="absolute left-0 top-0 w-full h-full object-cover object-center transition duration-50"
            loading="lazy"
            src={board.image}
          />
        </div>
      ) : (
        <div></div>
      )}

      <div className="flex-1 flex flex-col gap-2 py-3 px-4">
        <p className="text-xl font-bold">{board.title}</p>
        <div className="flex gap-2">
          <span className="badge badge-soft badge-primary">
            {board.is_active ? "Active" : "Inactive"}
          </span>
          <div className="badge badge-soft badge-secondary">
            {board.category}
          </div>
        </div>
        <p className="text-gray-500">
          {board.description.substring(0, 100)}...
        </p>

        <span className="flex items-center justify-start text-gray-500">
          <svg
            className="w-4 h-4 mr-1 mt-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clip-rule="evenodd"
            ></path>
          </svg>
          {board.attachments && board.attachments.length > 0 ? (
            <a
              href={board.attachments[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              download
            >
              Download Attachment
            </a>
          ) : (
            <span>No Attachments</span>
          )}
        </span>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
          >
            Update
          </Button>
          <Button
            onClick={onDelete}
            variant="danger"
            size="sm"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

interface Toast {
  id: string;
  type: 'confirm' | 'undo' | 'success' | 'error';
  title: string;
  message: string;
  boardId?: string;
  countdown?: number;
}

interface BoardsProps {
  onRefresh?: () => void;
}

export default function Boards({ onRefresh }: BoardsProps) {
  const { user, accessToken } = useAuth();
  const token = accessToken;
  const embassyId = user?.embassy_id || "";
  const userId = user?.id || "";

  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBoards = async () => {
    if (!embassyId) {
      setError("Embassy ID not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const variables = {
        embassy_id: embassyId,
        is_active: true,
        page: 1,
        limit: 22,
      };

      const result = await apolloClient.query<InformationBoardsQueryResult>({
        query: GET_INFORMATION_BOARDS,
        variables,
        fetchPolicy: "network-only",
      });

      if (result.data?.informationBoards) {
        setBoards(result.data.informationBoards);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch boards");
      console.error("Error fetching boards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardCreated = () => {
    // Refresh the boards list
    fetchBoards();
    // Trigger parent refresh for summary stats
    onRefresh?.();
  };

  const handleBoardUpdated = () => {
    // Refresh the boards list
    fetchBoards();
    setEditingBoard(null);
    // Trigger parent refresh for summary stats
    onRefresh?.();
  };

  const handleEditBoard = (board: Board) => {
    if (!board.id) return;
    setEditingBoard(board);
    setTimeout(() => {
      (document.getElementById(`edit_board_modal_${board.id}`) as HTMLDialogElement)?.showModal();
    }, 0);
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleDeleteBoard = async (board: Board) => {
    if (!board.id) return;

    const toastId = addToast({
      type: 'confirm',
      title: 'Delete Board?',
      message: `Are you sure you want to delete "${board.title}"?`,
      boardId: board.id,
    });
  };

  const startDeleteCountdown = (boardId: string) => {
    let countdown = 5;
    const toastId = addToast({
      type: 'undo',
      title: 'Deleting Board',
      message: `Board will be deleted in ${countdown} seconds. Click Undo to cancel.`,
      boardId,
      countdown,
    });

    countdownIntervalRef.current = setInterval(() => {
      countdown -= 1;
      setToasts(prev => prev.map(t => 
        t.id === toastId ? { ...t, countdown, message: `Board will be deleted in ${countdown} seconds. Click Undo to cancel.` } : t
      ));
    }, 1000);

    deleteTimerRef.current = setTimeout(() => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      executeDelete(boardId);
      removeToast(toastId);
    }, 5000);
  };

  const undoDelete = (boardId: string) => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setToasts(prev => prev.filter(t => t.boardId !== boardId));
    addToast({
      type: 'success',
      title: 'Deletion Cancelled',
      message: 'The board was not deleted.',
    });
  };

  const executeDelete = async (boardId: string) => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    const URL = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${URL}/information-boards/${boardId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete board");
      }

      addToast({
        type: 'success',
        title: 'Deleted Successfully',
        message: 'The board has been deleted.',
      });

      fetchBoards();
      onRefresh?.();
    } catch (err) {
      console.error("Error deleting board:", err);
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err instanceof Error ? err.message : "Failed to delete board",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = (boardId: string, toastId: string) => {
    removeToast(toastId);
    startDeleteCountdown(boardId);
  };

  useEffect(() => {
    fetchBoards();
  }, [embassyId]);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const openModal = () => {
    (document.getElementById('create_board_modal') as HTMLDialogElement)?.showModal();
  };

  return (
    <div>
      <div className="flex items-center flex-wrap lg:flex-nowrap justify-between">
        <h3 className="my-4 text-2xl font-bold text-blue-900">
          Manage Information Boards
        </h3>
        <div className="flex items-center justify-end gap-4 mb-4 lg:pt-0 pt-0">
          <Button variant="secondary" size="md" onClick={openModal}>
            Create New Board
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="w-full mx-auto grid gap-4 grid-cols-1 my-4">
          {boards.length > 0 ? (
            boards.map((board) => (
              <BoardCard
                key={board.id || board.title}
                {...board}
                onEdit={() => handleEditBoard(board)}
                onDelete={() => handleDeleteBoard(board)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No information boards found. Create your first board!
            </div>
          )}
        </div>
      )}
      <CreateBoardModal 
        embassyId={embassyId}
        userId={userId}
        onSuccess={handleBoardCreated}
      />
      {editingBoard && editingBoard.id && (
        <EditBoardModal
          board={editingBoard as Required<Pick<Board, 'id'>> & Board}
          onSuccess={handleBoardUpdated}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert pointer-events-auto shadow-lg max-w-full ${
              toast.type === 'confirm' ? 'alert-warning' :
              toast.type === 'undo' ? 'alert-info' :
              toast.type === 'success' ? 'alert-success' :
              'alert-error'
            }`}
          >
            <div className="flex-1">
              <h3 className="font-bold">{toast.title}</h3>
              <div className="text-sm">{toast.message}</div>
            </div>
            <div className="flex-none">
              {toast.type === 'confirm' && toast.boardId && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleConfirmDelete(toast.boardId!, toast.id)}
                  >
                    Yes, Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeToast(toast.id)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {toast.type === 'undo' && toast.boardId && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => undoDelete(toast.boardId!)}
                >
                  Undo
                </Button>
              )}
              {(toast.type === 'success' || toast.type === 'error') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeToast(toast.id)}
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
