import {
  FaShareNodes,
  FaRegThumbsUp,
  FaRegComments,
  FaRegBookmark,
} from "react-icons/fa6";

// stats demo array
const stats = [
  {
    id: 1,
    title: "Total Publications",
    value: "4,780",
    icon: <FaRegBookmark />,
  },
  {
    id: 2,
    title: "Total Events",
    value: "1",
    icon: <FaShareNodes />,
  },
  {
    id: 3,
    title: "Total Staff",
    value: "12",
    icon: <FaRegThumbsUp />,
  },
  {
    id: 4,
    title: "Total Messages",
    value: "12",
    icon: <FaRegComments />,
  },
  {
    id: 5,
    title: "Total Publications",
    value: "4,780",
    icon: <FaRegBookmark />,
  },
  {
    id: 6,
    title: "Total Events",
    value: "1",
    icon: <FaShareNodes />,
  },
  {
    id: 7,
    title: "Total Staff",
    value: "12",
    icon: <FaRegThumbsUp />,
  },
  {
    id: 8,
    title: "Total Messages",
    value: "12",
    icon: <FaRegComments />,
  },
];

export default function Stats() {
  return (
    <div className="flex flex-col justify-start h-screen pt-0">
      <div className="min-w-93.75 md:min-w-175 xl:min-w-200 mt-3 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-blue-100/20 rounded-2xl p-6 shadow-none hover:shadow-md transition-shadow border border-blue-200 border-t-8 border-t-blue-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">
                  {stat.value}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600 text-xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
