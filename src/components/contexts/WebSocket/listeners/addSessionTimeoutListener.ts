import {QueryClient} from '@tanstack/react-query';
import {signOut} from 'auth';
import {ClientSocket} from 'types';

export function addSessionTimeoutListener(
  socket: ClientSocket,
  queryClient: QueryClient,
) {
  socket.on('SESSION_TIMEOUT', async () => {
    queryClient.clear();
    socket.removeAllListeners();
    socket.disconnect();
    await signOut(undefined as any);
  });
}
