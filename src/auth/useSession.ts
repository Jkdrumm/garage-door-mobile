import {SessionContext} from 'components';
import {useContext} from 'react';

export function useSession() {
  return useContext(SessionContext).session;
}

export type SessionContextValue =
  | {
      data: Session;
      status: 'authenticated';
    }
  | {
      data: null;
      status: 'loading';
    };

export interface Session {
  user?: {
    id?: string | null;
  };
  expires: string;
}
