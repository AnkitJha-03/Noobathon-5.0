
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Supe } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import mockData from "@/data/db.json";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: supes } = useQuery({
    queryKey: ["supes"],
    queryFn: async () => mockData.supes,
  });

  const filteredSupes = supes?.filter((supe) =>
    supe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supe.powers.some((power) =>
      power.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold text-center">
          Track Superheroes in Real-Time
        </h1>
        <p className="text-gray-400 text-center">
          Monitor superhero activities, incidents, and breaking news
        </p>
        <Input
          type="search"
          placeholder="Search by name or power..."
          className="input-field w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSupes?.map((supe) => (
          <Link key={supe.id} to={`/supe/${supe.id}`}>
            <Card className="card-hover bg-supe h-full">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={supe.image}
                  alt={supe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{supe.name}</h3>
                    <p className="text-sm text-gray-400">{supe.affiliation}</p>
                  </div>
                  <div className="px-2 py-1 bg-primary rounded text-sm">
                    {supe.rating.toFixed(1)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {supe.powers.map((power) => (
                    <span
                      key={power}
                      className="px-2 py-1 bg-supe-light rounded-full text-xs"
                    >
                      {power}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <p>Last seen: {supe.status.lastLocation}</p>
                  <p>{supe.status.currentActivity}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
