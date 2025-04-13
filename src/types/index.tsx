export interface Circular {
    id: number;
    title: string;
    description?: string;
    user_email: string;
    created_at: string;
  }
  
  export interface Bid {
    id: number;
    proposal: string;
    tutor_email: string;
    circular_id: number;
    accepted: boolean;
  }
  
  export interface User {
    email: string;
  }