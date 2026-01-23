import { useNavigate } from "react-router";
import { BiChevronLeft } from "react-icons/bi";
import { RiHome5Line } from "react-icons/ri";
import Button from "./Button";


export default function BackButton() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/home_embassy");
  };

  return (
    <div className="mb-2 flex gap-2">
        <Button
      onClick={() => navigate(-1)}
      variant="secondary"
      rounded={true}
      size="md"
      className="cursor-pointer tooltip tooltip-bottom flex-1"
      data-tip="Go Back"
    >
      <BiChevronLeft className="inline mr-1" size={20}/>
      Go Back
    </Button>
    <Button onClick={goHome} variant="secondary" rounded={true} size="md" className="cursor-pointer tooltip tooltip-bottom flex-1" data-tip="Go Home">
      <RiHome5Line className="inline mr-1" size={20}/>
      Home
    </Button>
    </div>
  );
}