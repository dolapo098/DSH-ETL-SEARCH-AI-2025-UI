export interface UIState {
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

export enum UIMutationTypes {
  ADD_NOTIFICATION = 'ADD_NOTIFICATION'
}

export enum UIActionTypes {
  SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
  DISMISS_NOTIFICATION = 'DISMISS_NOTIFICATION'
}
