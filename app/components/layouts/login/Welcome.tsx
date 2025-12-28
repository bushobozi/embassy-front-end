import { Coat } from "~/images";

export default function Welcome() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center">
        <img src={Coat} alt="Coat of Arms" className="w-32 h-32 mx-auto mb-8" />
      </div>
      <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
    </div>
  );
}
