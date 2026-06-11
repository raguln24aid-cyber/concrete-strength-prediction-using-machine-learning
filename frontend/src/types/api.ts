export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
};

export type Prediction = {
  id?: string;
  strength_input: number;
  cement: number;
  blast_furnace_slag: number;
  fly_ash: number;
  water: number;
  superplasticizer: number;
  coarse_aggregate: number;
  fine_aggregate: number;
  age: number;
  created_at?: string;
};

export type HistoryItem = {
  id: string;
  user_id: string;
  strength_input: number;
  predicted_cement: number;
  predicted_blast_furnace_slag: number;
  predicted_fly_ash: number;
  predicted_water: number;
  predicted_superplasticizer: number;
  predicted_coarse_aggregate: number;
  predicted_fine_aggregate: number;
  predicted_age: number;
  created_at: string;
};

