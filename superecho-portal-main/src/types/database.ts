
export type UserRole = "citizen" | "supe" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email: string;
  createdAt: string;
}

export interface Supe {
  id: string;
  name: string;
  image: string;
  powers: string[];
  affiliation: string;
  status: {
    lastLocation: string;
    currentActivity: string;
    timestamp: string;
  };
  rating: number;
  controversies: Controversy[];
  achievements: Achievement[];
}

export interface News {
  id: string;
  title: string;
  content: string;
  category: "heroic" | "damage" | "scandal";
  image?: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
  createdBy: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  reportedBy: string;
  verified: boolean;
  likes: string[];
  dislikes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  username: string;
  createdAt: string;
}

export interface Controversy {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}
