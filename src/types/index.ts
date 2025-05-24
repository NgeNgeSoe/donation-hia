export type GetProjectModel = {
  current: ProjectWithTotalModel[] | null;
  completed: ProjectWithTotalModel[] | null;
};

export type ProjectWithTotalModel = {
  id: string;
  description: string;
  location: string;
  openingAmount: number;
  IncomeAmount: number;
  from: Date;
  to: Date | null;
};
