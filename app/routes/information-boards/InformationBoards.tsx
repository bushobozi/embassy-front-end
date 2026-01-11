import { useState } from "react";
import { Banner } from "~/components";
import InfoBoardSummary from "./components/InfoBoardSummary";
import Boards from "./components/Boards";

export default function InformationBoards() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    // Increment refresh key to trigger refresh in both components
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
        <Banner>
            Create And Manage Information Boards
        </Banner>
        <div>
          <InfoBoardSummary refreshKey={refreshKey} />
          <Boards onRefresh={handleRefresh} />
        </div>
    </div>
  );
}