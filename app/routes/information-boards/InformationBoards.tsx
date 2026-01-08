import { Banner } from "~/components";
import InfoBoardSummary from "./components/InfoBoardSummary";
import Boards from "./components/Boards";
export default function InformationBoards() {
  return (
    <div>
        <Banner>
            Create And Manage Information Boards
        </Banner>
        <div>
      <InfoBoardSummary />
    <Boards />
    </div>
    </div>
  );
}