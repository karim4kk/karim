
export interface Law {
  id: string;
  number: string;
  title: string;
  date: string;
  summary: string;
  pages: string;
  type: 'regulatory' | 'individual';
}

export interface Rank {
  title: string;
  branch: string;
  category: number;
  indexPoint: number;
  decree: string;
}

export interface Branch {
  name: string;
  description: string;
}
