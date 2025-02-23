import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SupeForm } from "@/components/supes/SupeForm";
import { Supe } from "@/types/database";
import mockData from "@/data/db.json";

export default function SupeProfile() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: supe } = useQuery({
    queryKey: ["supe", id],
    queryFn: async () => mockData.supes.find(s => s.id === id),
  });

  const handleSupeUpdate = (updatedData: Partial<Supe>) => {
    // In a real app, this would be an API call
    const updatedSupes = mockData.supes.map(s => 
      s.id === id ? { ...s, ...updatedData } : s
    );
    localStorage.setItem("supewatch_supes", JSON.stringify(updatedSupes));
    queryClient.invalidateQueries(["supe", id]);
  };

  if (!supe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Supe not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-6 items-start">
        <div className="w-1/3">
          <Card className="bg-supe overflow-hidden">
            <img
              src={supe.image}
              alt={supe.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2">{supe.name}</h1>
              <p className="text-gray-400 mb-4">{supe.affiliation}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {supe.powers.map((power) => (
                  <span
                    key={power}
                    className="px-3 py-1 bg-primary rounded-full text-sm"
                  >
                    {power}
                  </span>
                ))}
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                {supe.rating.toFixed(1)}
              </div>
              <p className="text-sm text-gray-400">Fan Rating</p>
              {isAdmin && (
                <div className="mt-4">
                  <SupeForm
                    supe={supe}
                    onSubmit={handleSupeUpdate}
                    trigger={<Button variant="outline" className="w-full">Edit Supe</Button>}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <Card className="bg-supe p-6">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            <div className="space-y-2 text-gray-300">
              <p>📍 Location: {supe.status.lastLocation}</p>
              <p>🎯 Activity: {supe.status.currentActivity}</p>
              <p>
                🕒 Updated:{" "}
                {new Date(supe.status.timestamp).toLocaleString()}
              </p>
            </div>
            {isAdmin && (
              <button className="btn-primary mt-4">Update Status</button>
            )}
          </Card>

          <Card className="bg-supe p-6">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="space-y-4">
              {supe.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="border-b border-gray-700 last:border-0 pb-4 last:pb-0"
                >
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-gray-400">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-supe p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Controversies
            </h2>
            <div className="space-y-4">
              {supe.controversies.map((controversy) => (
                <div
                  key={controversy.id}
                  className="border-b border-gray-700 last:border-0 pb-4 last:pb-0"
                >
                  <h3 className="font-medium">{controversy.title}</h3>
                  <p className="text-sm text-gray-400">
                    {controversy.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(controversy.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
