export interface Board {
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

export function BoardCard(board: Board) {
  return (
    <div className="flex gap-4 bg-white border border-gray-300 rounded-3xl overflow-hidden items-center justify-start max-w-3xl hover:shadow-sm transition-shadow">
      {board.image ? (
        <div className="relative w-32 h-full flex-1">
        <img
          className="absolute left-0 top-0 w-full h-full object-cover object-center transition duration-50"
          loading="lazy"
          src={board.image}
        />
      </div>      ) : (
        <div></div>
      )}

      <div className="flex-1 flex flex-col gap-2 py-3 px-4">
        <p className="text-xl font-bold">{board.title}</p>
        <div className="flex gap-2">
            <span className="badge badge-soft badge-primary">{board.is_active ? "Active" : "Inactive"}</span>
            <div className="badge badge-soft badge-secondary">{board.category}</div>
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
        {/* <span>Created {board.created_at} by {board.created_by}</span> */}
      </div>
    </div>
  );
}

export default function Boards() {
  return (
    <div>
         <h3 className="my-4 text-2xl font-bold text-blue-900">
          Manage Information Boards
        </h3>
      <div className="w-full mx-auto my-8 grid gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
        <BoardCard
          title="Community Events Board"
          category="Events"
          embassy_id="embassy123"
        //   image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tbXVuaXR5JTIwZXZlbnRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
          description="Stay updated with the latest community events happening around you. From cultural festivals to local meetups, find all the information you need in one place."
          is_active={true}
          location="Main Hall"
          created_by="user123"
          created_at="2023-10-01T10:00:00Z"
          updated_at="2023-10-05T12:00:00Z"
        />
        <BoardCard
          title="Job Opportunities Board"
          category="Jobs"
          embassy_id="embassy123"
        //   image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8am9iJTIwb3Bwb3J0dW5pdGllc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
          description="Explore the latest job opportunities available within the community. Whether you're looking for part-time work or full-time careers, our job board has something for everyone."
          is_active={true}
          location="Career Center"
          created_by="user456"
          created_at="2023-09-15T09:30:00Z"
          updated_at="2023-10-02T11:15:00Z"
        />
        <BoardCard
          title="Job Opportunities Board"
          category="Jobs"
          embassy_id="embassy123"
        //   image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8am9iJTIwb3Bwb3J0dW5pdGllc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
          description="Explore the latest job opportunities available within the community. Whether you're looking for part-time work or full-time careers, our job board has something for everyone."
          is_active={true}
          location="Career Center"
          created_by="user456"
          created_at="2023-09-15T09:30:00Z"
          updated_at="2023-10-02T11:15:00Z"
        />
      </div>
    </div>
  );
}
