export interface Alert {
  isShown: boolean;
  message: string;
  status: boolean;
  type?: AlertType;
  timeout?: number;
}

export enum AlertType {
  SUCCESS,
  ERROR,
  WARNING,
  INFO
}
