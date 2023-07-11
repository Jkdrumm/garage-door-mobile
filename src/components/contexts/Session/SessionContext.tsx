import {createContext} from 'react';

export type SessionContextValue = {
  session: SessionValue;
  setSession: React.Dispatch<React.SetStateAction<SessionValue>>;
};

export const SessionContext = createContext<SessionContextValue>({
  session: {
    data: null,
    status: 'loading',
  },
} as SessionContextValue);

export type SessionValue =
  | {
      data: Session;
      status: 'authenticated';
    }
  | {
      data: null;
      status: 'loading';
    }
  | {
      data: null;
      status: 'loggingOut';
    };

export interface Session {
  user?: {
    id?: string | null;
  };
  expires: string;
}
