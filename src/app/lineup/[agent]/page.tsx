"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const agentLineups = {
  Sova: "Here are Sova's lineups...",
  Brimstone: "Here are Brimstone's lineups...",
  Viper: "Here are Viper's lineups...",
  Killjoy: "Here are Killjoy's lineups...",
  Harbor: "Here are Harbor's lineups...",
  Cypher: "Here are Cypher's lineups...",
  Yoru: "Here are Yoru's lineups...",
  Fade: "Here are Fade's lineups...",
};

export default function AgentLineup() {
  const params = useParams(); // useParams to access the dynamic route
  const agent = params.agent; // Get the dynamic 'agent' parameter

  if (!agent) {
    return <div>Loading...</div>;
  }

  const lineup = agentLineups[agent as keyof typeof agentLineups] || "No lineups available for this agent.";

  return (
    <>
      {/* Main layout */}
      <main className="container mx-auto p-6 flex space-x-6">
        {/* Sidebar */}
        <aside className="w-1/4 p-4 border rounded-md h-screen">
          <nav>
            <ul className="space-y-4">
              <li><Link href="/agents/sova" className="text-blue-500">Sova</Link></li>
              <li><Link href="/agents/brimstone" className="text-blue-500">Brimstone</Link></li>
              <li><Link href="/agents/viper" className="text-blue-500">Viper</Link></li>
              <li><Link href="/agents/killjoy" className="text-blue-500">Killjoy</Link></li>
              <li><Link href="/agents/harbor" className="text-blue-500">Harbor</Link></li>
              <li><Link href="/agents/cypher" className="text-blue-500">Cypher</Link></li>
              <li><Link href="/agents/yoru" className="text-blue-500">Yoru</Link></li>
              <li><Link href="/agents/fade" className="text-blue-500">Fade</Link></li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <section className="w-3/4">
          <h1 className="text-3xl font-bold mb-6">{agent} Lineups</h1>
          <div className="mb-6">{lineup}</div>
          
          {/* Carousel */}
          <Carousel className="mx-12">
            <CarouselContent>
              <CarouselItem>
                <img src="/img/1.jpg" alt="Lineup 1" className="w-full h-auto rounded-xl" />
              </CarouselItem>
              <CarouselItem>
                <img src="/img/2.jpg" alt="Lineup 2" className="w-full h-auto rounded-xl" />
              </CarouselItem>
              <CarouselItem>
                <img src="/img/3.jpg" alt="Lineup 3" className="w-full h-auto rounded-xl" />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <Link href="/" className="mt-4 inline-block text-blue-500">
            Back to home
          </Link>
        </section>
      </main>
    </>
  );
}
