type BannerProps = {
  children: React.ReactNode;
};

export default function Banner({ children }: BannerProps) {
  return (
    <div className="bg-blue-600 text-white p-8 rounded-2xl mb-6 shadow-0 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold">Statistics Overview</h2>
      <h1 className="mt-2 text-5xl font-bold">
        {children}
      </h1>
    </div>
  );
}
