
export interface Participant {
  id: string;
  name: string;
  hasWon?: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export enum AppTab {
  INPUT = 'input',
  DRAW = 'draw',
  GROUPING = 'grouping'
}
