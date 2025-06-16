export interface Account {
  id: number;
  name: string;
  description?: string;
  balance: number;
  isMain: boolean;
  createdAt: Date;
  ownerId: number;
  ownerEmail: string;
  sharedWith?: AccountUser[];
}

export interface AccountUser {
  userId: number;
  userEmail: string;
  accessLevel: string;
  addedAt: Date;
}
