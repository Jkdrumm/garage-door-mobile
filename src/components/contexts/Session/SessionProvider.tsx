import {PropsWithChildren, useState} from 'react';
import {SessionContext, SessionValue} from './SessionContext';

export function SessionProvider({children}: PropsWithChildren) {
  const [session, setSession] = useState<SessionValue>({
    data: null,
    status: 'loading',
  });

  return (
    <SessionContext.Provider value={{session, setSession}}>
      {children}
    </SessionContext.Provider>
  );
}
