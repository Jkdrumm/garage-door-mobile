import axios from 'axios';
import {getCsrf} from './util';
import {SessionValue} from 'components';
import type {QueryClient} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function signOut(
  setSession: React.Dispatch<React.SetStateAction<SessionValue>>,
  queryClient: QueryClient,
) {
  try {
    const csrf = await getCsrf(queryClient);
    const domain = queryClient.getQueryData<string>(['domain']);
    await axios.post(
      `${domain}/api/auth/signout`,
      {
        csrfToken: csrf,
        json: true,
        callbackUrl: 'http://localhost/home',
      },
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
          cookie: `next-auth.csrf-token=${csrf};`,
        },
      },
    );
    await AsyncStorage.removeItem('session');
    queryClient.clear();
    setSession({data: null, status: 'loggingOut'});
  } catch (error) {
    console.log('Logout failed');
    console.log(error);
  }
}
