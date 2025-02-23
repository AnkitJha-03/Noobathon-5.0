
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Incident } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Incidents() {
  const { isAdmin, user } = useAuth();
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const { toast } = useToast();

  const [showNewIncidentForm, setShowNewIncidentForm] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    location: "",
  });

  const { data: incidents, refetch } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      return JSON.parse(localStorage.getItem("incidents") || "[]");
    },
  });

  const filteredIncidents = incidents?.filter(
    (incident) => !showVerifiedOnly || incident.verified
  );

  const handleNewIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const incident = {
      id: `incident${Date.now()}`,
      ...newIncident,
      timestamp: new Date().toISOString(),
      reportedBy: user.username,
      verified: false,
      likes: [],
      dislikes: [],
      comments: [],
    };

    const storedIncidents = JSON.parse(localStorage.getItem("incidents") || "[]");
    localStorage.setItem("incidents", JSON.stringify([...storedIncidents, incident]));
    
    toast({
      title: "Incident reported",
      description: "Your incident has been submitted for verification.",
    });
    
    setNewIncident({ title: "", description: "", location: "" });
    setShowNewIncidentForm(false);
    refetch();
  };

  const handleVerify = (incidentId: string) => {
    if (!isAdmin) return;

    const storedIncidents = JSON.parse(localStorage.getItem("incidents") || "[]");
    const updatedIncidents = storedIncidents.map((incident: Incident) =>
      incident.id === incidentId ? { ...incident, verified: true } : incident
    );
    localStorage.setItem("incidents", JSON.stringify(updatedIncidents));
    refetch();
    
    toast({
      title: "Incident verified",
      description: "The incident has been marked as verified.",
    });
  };

  const handleVote = (incidentId: string, voteType: 'like' | 'dislike') => {
    if (!user) return;

    const storedIncidents = JSON.parse(localStorage.getItem("incidents") || "[]");
    const updatedIncidents = storedIncidents.map((incident: Incident) => {
      if (incident.id === incidentId) {
        // Remove user from both arrays first
        const filteredLikes = incident.likes.filter((userId: string) => userId !== user.id);
        const filteredDislikes = incident.dislikes.filter((userId: string) => userId !== user.id);

        // Add user to the selected vote type
        if (voteType === 'like') {
          filteredLikes.push(user.id);
        } else {
          filteredDislikes.push(user.id);
        }

        return {
          ...incident,
          likes: filteredLikes,
          dislikes: filteredDislikes,
        };
      }
      return incident;
    });

    localStorage.setItem("incidents", JSON.stringify(updatedIncidents));
    refetch();
  };

  const handleAddComment = (incidentId: string, content: string) => {
    if (!user) return;

    const storedIncidents = JSON.parse(localStorage.getItem("incidents") || "[]");
    const updatedIncidents = storedIncidents.map((incident: Incident) =>
      incident.id === incidentId
        ? {
            ...incident,
            comments: [
              ...incident.comments,
              {
                id: `comment${Date.now()}`,
                content,
                userId: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : incident
    );
    localStorage.setItem("incidents", JSON.stringify(updatedIncidents));
    refetch();

    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    });
  };

  const hasUserVoted = (incident: Incident, voteType: 'like' | 'dislike') => {
    if (!user) return false;
    return incident[voteType + 's'].includes(user.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Incident Reports</h1>
        {user && !isAdmin && (
          <Button className="btn-primary" onClick={() => setShowNewIncidentForm(true)}>
            Report Incident
          </Button>
        )}
      </div>

      {showNewIncidentForm && (
        <Card className="bg-supe p-6">
          <h2 className="text-xl font-semibold mb-4">Report New Incident</h2>
          <form onSubmit={handleNewIncident} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <Input
                required
                value={newIncident.title}
                onChange={(e) =>
                  setNewIncident({ ...newIncident, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                required
                className="w-full rounded-md p-2"
                rows={3}
                value={newIncident.description}
                onChange={(e) =>
                  setNewIncident({ ...newIncident, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Location</label>
              <Input
                required
                value={newIncident.location}
                onChange={(e) =>
                  setNewIncident({ ...newIncident, location: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Submit Report</Button>
              <Button
                variant="outline"
                onClick={() => setShowNewIncidentForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-4">
        <Button
          variant={showVerifiedOnly ? "default" : "outline"}
          onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
        >
          {showVerifiedOnly ? "Show All" : "Verified Only"}
        </Button>
      </div>

      <div className="space-y-6">
        {filteredIncidents?.map((incident) => (
          <Card key={incident.id} className="bg-supe p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {incident.title}
                    {incident.verified && (
                      <CheckCircle className="text-primary h-5 w-5" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Reported by {incident.reportedBy}
                  </p>
                </div>
                {isAdmin && !incident.verified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(incident.id)}
                  >
                    Verify
                  </Button>
                )}
              </div>

              <p className="text-gray-300">{incident.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="space-x-4">
                  <span>📍 {incident.location}</span>
                  <span>
                    🕒{" "}
                    {new Date(incident.timestamp).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleVote(incident.id, 'like')}
                    className={`flex items-center gap-1 hover:text-primary transition-colors ${
                      hasUserVoted(incident, 'like') ? 'text-primary' : ''
                    }`}
                    disabled={!user}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {incident.likes.length}
                  </button>
                  <button
                    onClick={() => handleVote(incident.id, 'dislike')}
                    className={`flex items-center gap-1 hover:text-destructive transition-colors ${
                      hasUserVoted(incident, 'dislike') ? 'text-destructive' : ''
                    }`}
                    disabled={!user}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    {incident.dislikes.length}
                  </button>
                  <span>💬 {incident.comments.length}</span>
                </div>
              </div>

              {incident.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="font-medium mb-2">Comments</h4>
                  <div className="space-y-2">
                    {incident.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-black/20 p-3 rounded-lg"
                      >
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {comment.username} •{" "}
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {user && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const comment = (form.elements.namedItem("comment") as HTMLInputElement).value;
                      handleAddComment(incident.id, comment);
                      form.reset();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      name="comment"
                      placeholder="Add a comment..."
                      required
                    />
                    <Button type="submit">Comment</Button>
                  </form>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
