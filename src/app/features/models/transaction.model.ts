export interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: TransactionType;
  createdAt: Date;
  sourceAccountId?: number;
  sourceAccountName?: string;
  destinationAccountId?: number;
  destinationAccountName?: string;
  createdById: number;
  createdByEmail: string;
}

export enum TransactionType {
  Deposit = 'Deposit',
  Withdrawal = 'Withdrawal',
  Transfer = 'Transfer'
}
