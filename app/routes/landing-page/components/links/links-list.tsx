import data from "../../data/data.json";

type LinkItem = {
  name: string;
  url: string;
  description?: string;
};

type Category = {
  id?: string;
  title?: string;
  items?: LinkItem[];
};

export default function LinksList() {
  const ministries: Array<Category | LinkItem> = (data as any).ministries || [];

  const categories = ministries.filter(
    (m) => (m as any).items && Array.isArray((m as any).items)
  ) as Category[];
  const uncategorized = ministries.filter(
    (m) => !(m as any).items
  ) as LinkItem[];

  // helper: split an array into N columns with roughly even distribution
  const splitIntoColumns = <T,>(items: T[], cols = 3): T[][] => {
    const result: T[][] = Array.from({ length: cols }, () => []);
    items.forEach((item, idx) => {
      result[idx % cols].push(item);
    });
    return result;
  };

  return (
    <section aria-labelledby="links-heading" className="my-8">
      <h2
        id="links-heading"
        className="text-5xl font-semibold mb-4 border-b pb-4 border-gray-200"
      >
        Government Links
      </h2>

      {categories.map((cat) => (
        <div key={cat.id ?? cat.title} className="mb-6">
          <h3 className="text-3xl font-medium mb-6">{cat.title}</h3>

          {/* grid with up to 3 columns, each column has a left rule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {splitIntoColumns(cat.items || [], 3).map((col, colIdx) => (
              <ul
                key={colIdx}
                className="space-y-3 border-l-3 border-red-500 pl-6"
              >
                {col.map((it) => (
                  <li key={(it as any).url} className="text-gray-800">
                    <a
                      href={(it as any).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      {(it as any).name}
                    </a>
                    {(it as any).description ? (
                      <p className="text-sm text-gray-600 mt-1">
                        {(it as any).description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}

      {uncategorized.length > 0 && (
        <div className="mb-6">
          <h3 className="text-3xl font-medium mb-4">Other Government Links</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {uncategorized.map((it) => (
              <li
                key={(it as any).url}
                className="text-gray-700 hover:text-gray-900 flex items-start flex-col p-4 border-l-3 border-yellow-300 bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
              >
                <a
                  href={(it as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-medium text-lg"
                >
                  {(it as any).name}
                </a>
                {(it as any).description ? (
                  <p className="text-sm text-gray-600 mt-2">
                    {(it as any).description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
