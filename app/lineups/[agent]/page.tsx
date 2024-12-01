"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import maps from "@/data/maps";
import { createClient } from "@/utils/supabase/client";
import { ClipLoader } from "react-spinners";

export default function AgentLineup({
  params: paramsPromise,
}: {
  params: Promise<{ agent: string }>;
}) {
  const params = React.use(paramsPromise);
  const supabase = createClient();
  const [lineups, setLineups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const searchParams = useSearchParams();
  const agent = searchParams.get("agent") || "";
  const [currentMap, setCurrentMap] = useState("All"); // Track selected map

  const fetchLineups = async (mapFilter: string) => {
    try {
      setLoading(true);
      const query = supabase.from("lineups").select().eq("agent", params.agent);

      if (mapFilter !== "All") {
        query.eq("map", mapFilter); // Apply map filter if not "All"
      }

      const { data: lineups, error } = await query;

      if (error) {
        console.error("Error fetching lineups:", error.message);
        return;
      }
      setLineups(lineups);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchLineups(currentMap); // Fetch lineups based on the selected map
  }, [currentMap]);

  if (loading) {
    return (
      <main className="w-full h-svh flex justify-center items-center">
        <ClipLoader color="#3498db" loading={loading} size={50} />
      </main>
    );
  }

  return (
    <main className="w-full mx-auto sm:min-w-0 min-w-72 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-blue-500">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/lineups/${params.agent}`}
              className="font-semibold"
            >
              {params.agent}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:flex-[1] lg:pr-4">
          <nav>
            <ul className="space-y-2">
              <li
                className={`block font-semibold rounded-md p-2 transition-colors cursor-pointer ${currentMap === "All"
                  ? "bg-primary text-secondary"
                  : "hover:bg-muted"
                  }`}
                onClick={() => setCurrentMap("All")}
              >
                <h3>All</h3>
              </li>
              {maps.map((map) => (
                <li
                  key={map.id}
                  className={`block font-semibold rounded-md p-2 transition-colors cursor-pointer ${currentMap === map.name
                    ? "bg-primary text-secondary"
                    : "hover:bg-muted"
                    }`}
                  onClick={() => setCurrentMap(map.name)}
                >
                  <h3>{map.name}</h3>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <section className="lg:flex-[3]">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6">
            {params.agent} Lineups
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lineups.length > 0 ? (
              lineups.map((lineup) => (
                <Dialog key={lineup.id}>
                  <DialogTrigger>
                    <div className="space-y-2">
                      <img
                        src={lineup.image_urls?.[0] || "/fallback-image.jpg"}
                        className="h-40 w-full sm:w-72 rounded-sm object-cover"
                        alt={lineup.title || "No title"}
                      />
                      <div className="flex flex-col justify-between items-start">
                        <h1>{lineup.title || "Unknown Title"}</h1>
                        <p className="text-sm text-blue-300">
                          {lineup.sides || "N/A"}
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Lineup Details</DialogTitle>
                      <DialogDescription>
                        Explore the detailed lineup for this map and agent.
                      </DialogDescription>
                    </DialogHeader>
                    <Carousel className="mx-4 sm:mx-12">
                      <CarouselContent>
                        {lineup.image_urls?.map((image: string, index: number) => (
                          <CarouselItem key={index}>
                            <div className="flex justify-center">
                              <img
                                src={image}
                                alt={`Lineup ${index + 1}`}
                                className="rounded-md"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <div
                className="h-40 w-full sm:w-72"
              >
                <p className="text-gray-500">
                  No lineups found for this agent and map.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
