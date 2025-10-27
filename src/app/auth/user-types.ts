export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
  subscriptionPlan: string;
}

export interface GetUserSessionResponse {
  success: boolean;
  data: {
    user: User;
  };
}
