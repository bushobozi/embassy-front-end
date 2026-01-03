import { Coat } from "~/images";

type BannerProps = {
  children: React.ReactNode;
};

export default function Banner({ children }: BannerProps) {
  return (
    <div className="bg-blue-200 text-white p-8 rounded-b-2xl mb-6 shadow-0 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">Overview</h2>
      <h1 className="mt-2 text-4xl font-bold text-blue-900">
        {children}
      </h1>
        </div>
        <div>
          <img src={Coat} alt="Coat of Arms" className="h-16 ml-4" />
        </div>
      </div>
    </div>
  );
}
