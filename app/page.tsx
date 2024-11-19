import Hero from "@/components/hero";
import agents from "@/data/agent";
import Link from "next/link";

export default async function Index() {
  return (
    <div className="container py-20">
      <Hero />
      <main>
        <div className="flex flex-wrap gap-4 justify-center"> {/* Responsive grid layout */}
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="relative w-40  h-60 bg-[radial-gradient(circle,_rgba(var(--card),0.8),_rgba(var(--card),0.8))] border border-gray-300 shadow-lg transition duration-200 overflow-hidden group hover:border-blue-500"
            >
              <Link href={`/lineups/${agent.name}`}>
                <img
                  src={agent.imgSrc}
                  alt={agent.name}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-10 transition-transform duration-200 object-cover scale-150 group-hover:scale-110" // Zoom on hover
                />
                <h1 className="w-full px-4 py-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 text-md font-bold text-white bg-slate-800 bg-opacity-80 transition duration-200 group-hover:bg-blue-500">
                  {agent.name}
                </h1>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
