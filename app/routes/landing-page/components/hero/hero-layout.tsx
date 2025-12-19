import Nav from "../nav/nav";

export const HeroLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <section className="w-screen min-h-[75vh] bg-gray-950 text-white px-4 py-8">
      <Nav />
      <div className="w-full pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">{children}</div>
      </div>
    </section>
  );
};
