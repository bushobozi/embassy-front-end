interface ProfileTabsProps {
  activeTab: "personal" | "education" | "history";
  onTabChange: (tab: "personal" | "education" | "history") => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: "personal" as const, label: "Personal Details" },
    { id: "education" as const, label: "Biography" },
    { id: "history" as const, label: "Profile History" },
  ];

  return (
    <div className="flex px-0 border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 font-medium transition-colors relative cursor-pointer tooltip tooltip-bottom ${
            activeTab === tab.id
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          data-tip={tab.label}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      ))}
    </div>
  );
}
