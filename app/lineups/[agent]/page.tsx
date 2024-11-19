"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { createClient } from '@/utils/supabase/client';

const agentLinupss = {
  map: "ascent",
  items: [
    { id: 1, imgUrl: "/img/1.jpg", title: "Judul Lineups", side: "Attacking" },
    { id: 2, imgUrl: "/img/1.jpg", title: "Judul Lineups", side: "Attacking" },
    { id: 3, imgUrl: "/img/1.jpg", title: "Judul Lineups", side: "Attacking" },
    { id: 4, imgUrl: "/img/1.jpg", title: "Judul Lineups", side: "Attacking" },
    { id: 5, imgUrl: "/img/1.jpg", title: "Judul Lineups", side: "Attacking" },
    { id: 6, imgUrl: "/img/1.jpg", title: "Judul Lineups", side: "Attacking" },
  ],
};

export default function AgentLineup({
  params: paramsPromise,
}: {
  params: Promise<{ agent: string }>;
}) {
  const params = React.use(paramsPromise);
  const supabase = createClient();
  const [lineups, setLineups] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const agent = searchParams.get("agent") || "sova";
  const currentMap = searchParams.get("map") || "Ascent";

  const fetchLineups = async () => {
    try {
      const { data: lineups, error } = await supabase.from('lineups').select();

      if (error) {
        console.error('Error fetching lineups:', error.message);
        return;
      }
      setLineups(lineups);
      console.log('Fetched lineups:', lineups);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  useEffect(() => {
    fetchLineups();
  }, []);

  return (
    <main className="w-full h-svh mx-auto px-4 py-8">
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
            <BreadcrumbLink href={`/lineups/${params.agent}`} className="font-semibold">
              {params.agent}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex gap-4">
        {/* Sidebar */}
        <aside className="flex-[1] border-r pr-4">
          <nav>
            <ul className="space-y-2">
              {maps.map((map) => (
                <Link
                  key={map.id}
                  href={`/lineups/${params.agent}/?agent=${agent}&map=${map.name}`}
                  className={`block font-semibold rounded-md p-2 transition-colors ${currentMap === map.name
                    ? "bg-primary text-secondary"
                    : ""
                    } hover:bg-muted`}
                >
                  <h3>{map.name}</h3>
                </Link>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <section className="flex-[3]">
          <h1 className="text-3xl font-bold mb-6">{params.agent} Lineups</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lineups.map((lineup) => (
              <Dialog key={lineup.id}>
                <DialogTrigger>
                  <div className="space-y-2">
                    <img
                      src={lineup.image_urls?.[0] || "/fallback-image.jpg"}
                      className="h-40 w-72 rounded-sm object-cover"
                      alt={lineup.title || "No title"}
                    />
                    <div className="flex flex-col justify-between items-start">
                      <h1>{lineup.title || "Unknown Title"}</h1>
                      <p className="text-sm text-blue-300">{lineup.sides || "N/A"}</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="w-full max-w-5xl h-auto p-8 bg-white dark:bg-gray-800 overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Lineup Details</DialogTitle>
                    <DialogDescription>
                      Explore the detailed lineup for this map and agent.
                    </DialogDescription>
                  </DialogHeader>
                  <Carousel className="mx-12">
                    <CarouselContent>
                      {lineup.image_urls?.map((image: string, index: number) => (
                        <CarouselItem key={index}>
                          <div className="flex justify-center">
                            <img
                              src={image}
                              alt={`Lineup ${index + 1}`}
                              className="w-full max-w-[720px] h-[480px] rounded-xl object-cover"
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
            ))}
          </div>
        </section>
      </div>
    </main>

  );
}
