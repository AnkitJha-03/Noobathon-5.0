
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { News as NewsType } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import mockData from "@/data/db.json";

type NewsCategory = NewsType["category"];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "all">("all");
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const [showNewNewsForm, setShowNewNewsForm] = useState(false);
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    category: "heroic" as NewsType["category"],
    image: "",
  });

  const { data: news, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const storedNews = JSON.parse(localStorage.getItem("news") || "[]");
      return [...mockData.news, ...storedNews];
    },
  });

  const filteredNews = news?.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newsItem = {
      id: `news${Date.now()}`,
      ...newNews,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
      createdBy: user.username,
    };

    const storedNews = JSON.parse(localStorage.getItem("news") || "[]");
    localStorage.setItem("news", JSON.stringify([...storedNews, newsItem]));

    toast({
      title: "News added",
      description: "The news article has been published.",
    });

    setNewNews({
      title: "",
      content: "",
      category: "heroic",
      image: "",
    });
    setShowNewNewsForm(false);
    refetch();
  };

  const handleLike = (newsId: string) => {
    if (!user) return;
    const storedNews = JSON.parse(localStorage.getItem("news") || "[]");
    const updatedNews = storedNews.map((item: NewsType) =>
      item.id === newsId ? { ...item, likes: item.likes + 1 } : item
    );
    localStorage.setItem("news", JSON.stringify(updatedNews));
    refetch();
  };

  const categories: Array<{ value: NewsCategory | "all"; label: string }> = [
    { value: "all", label: "All News" },
    { value: "heroic", label: "Heroic Acts" },
    { value: "damage", label: "Collateral Damage" },
    { value: "scandal", label: "Scandals" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Latest News</h1>
        {isAdmin && (
          <Button className="btn-primary" onClick={() => setShowNewNewsForm(true)}>
            Add News
          </Button>
        )}
      </div>

      {showNewNewsForm && (
        <Card className="bg-supe p-6">
          <h2 className="text-xl font-semibold mb-4">Add News Article</h2>
          <form onSubmit={handleAddNews} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <Input
                required
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Content</label>
              <textarea
                required
                className="w-full rounded-md p-2"
                rows={3}
                value={newNews.content}
                onChange={(e) =>
                  setNewNews({ ...newNews, content: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select
                className="w-full rounded-md p-2"
                value={newNews.category}
                onChange={(e) =>
                  setNewNews({
                    ...newNews,
                    category: e.target.value as NewsType["category"],
                  })
                }
              >
                <option value="heroic">Heroic Acts</option>
                <option value="damage">Collateral Damage</option>
                <option value="scandal">Scandals</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Image URL (optional)</label>
              <Input
                value={newNews.image}
                onChange={(e) => setNewNews({ ...newNews, image: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Publish</Button>
              <Button
                variant="outline"
                onClick={() => setShowNewNewsForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {categories.map(({ value, label }) => (
          <Button
            key={value}
            variant={selectedCategory === value ? "default" : "outline"}
            onClick={() => setSelectedCategory(value)}
            className="min-w-[120px]"
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredNews?.map((item) => (
          <Card key={item.id} className="bg-supe overflow-hidden">
            {item.image && (
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 space-y-4">
              <div>
                <span className="text-xs font-medium px-2 py-1 bg-primary rounded-full">
                  {item.category}
                </span>
                <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
              </div>
              <p className="text-gray-400 line-clamp-3">{item.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>By {item.createdBy}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(item.id)}
                    className="hover:text-primary transition-colors"
                    disabled={!user}
                  >
                    👍 {item.likes}
                  </button>
                  <span>👎 {item.dislikes}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
