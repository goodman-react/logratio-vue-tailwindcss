export interface IOpenQuestion {
  desc: string;
  canBeNull: boolean;
  topics: { [_: string]: string[] };

  type: "OPEN";
}

export interface IClosedQuestion {
  desc: string;
  canBeNull: boolean;
  answers: string[];
  type: "CLOSED" | "MULTI";
}
