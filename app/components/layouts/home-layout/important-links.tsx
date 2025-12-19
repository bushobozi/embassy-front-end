import { FaChevronRight } from "react-icons/fa";
function leaveMessageAlert() {
  alert("You are about to leave the dashboard.");
}
const importantLinks = [
  {
    name: "Explore Uganda",
    href: "https://exploreuganda.com/",
  },
  {
    name: "Uganda Investment Authority",
    href: "https://ugandainvest.go.ug/",
  },
  {
    name: "Uganda Coffee Development Authority",
    href: "https://ugandacoffee.go.ug/",
  },
  {
    name: "Uganda Wildlife Authority",
    href: "https://ugandawildlife.org/",
  },
  {
    name: "Uganda Revenue Authority",
    href: "https://www.ura.go.ug/",
  },
  {
    name: "Uganda Free Zones Authority",
    href: "https://ufzepa.go.ug/",
  },
];

export default function ImportantLinks() {
  return (
    <div>
      <ul className="list-disc space-y-2 overflow-y-auto max-h-[80vh]">
        {importantLinks.map((link) => (
          <li
            key={link.name}
            className="
            text-gray-700 hover:text-gray-900 flex items-center justify-between p-2 border-l-3 border-blue-500 hover:border-blue-500
             cursor-pointer bg-gray-50 hover:bg-blue-100/50 transition-colors duration-200
            "
          >
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={leaveMessageAlert}
              className="text-gray-950 font-medium hover:underline"
            >
              {link.name}
            </a>
            <a
              href={link.href}
              className="text-gray-800 hover:underline"
              target="_blank"
              onClick={leaveMessageAlert}
            >
              <FaChevronRight className="inline-block ml-1 w-4 h-4 font-mono" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
