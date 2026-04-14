export type TransactionType = "income" | "expense";

export type TransactionRecord = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  type: TransactionType;
  amount: number;
  transaction_date: string;
  created_at: string;
};

export type ReceivedMonthShare = {
  share_id: string;
  owner_id: string;
  owner_email: string;
  owner_name: string | null;
  month_key: string;
};

export type MonthCollaborator = {
  share_id: string;
  collaborator_id: string;
  collaborator_email: string;
  collaborator_name: string | null;
  month_key: string;
};
