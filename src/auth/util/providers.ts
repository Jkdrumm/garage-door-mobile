import {QueryClient} from '@tanstack/react-query';
import axios from 'axios';

export function getProviders(queryClient: QueryClient) {
  const domain = queryClient.getQueryData<string>(['domain']);
  return axios.get<ProviderData>(`${domain}/api/auth/providers`);
}

export type ProviderData = {
  credentials: {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  };
};
