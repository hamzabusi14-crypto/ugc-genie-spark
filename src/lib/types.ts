export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  credits: number;
  plan: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  product_name: string;
  product_image_url: string;
  video_url: string | null;
  thumbnail_url: string | null;
  status: "generating" | "done" | "failed";
  duration: string;
  aspect_ratio: string;
  language: string;
  country: string;
  description: string | null;
  task_id: string | null;
  current_segment: number;
  total_segments: number | null;
  model: string;
  credits_used: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: "debit" | "credit" | "subscription";
  amount: number;
  credits: number;
  description: string;
  created_at: string;
}

export interface ScriptSegment {
  id: string;
  video_id: string;
  segment_number: number;
  paragraph_text: string;
  status: "pending" | "done";
  created_at: string;
}

export const CREDIT_COSTS: Record<string, number> = {
  "8s": 10,
  "15s": 50,
  "22s": 75,
};

export const PLANS = [
  { key: "starter", price: 5, credits: 50 },
  { key: "pro", price: 19, credits: 200 },
  { key: "premium", price: 49, credits: 600 },
  { key: "ultimate", price: 99, credits: 1500 },
] as const;
