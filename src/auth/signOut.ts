import {getCsrf} from './util';
import {SessionValue} from 'components';
import type {QueryClient} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchAllowLocal} from './fetchAllowLocal';
import {DomainInfo} from 'types';

export async function signOut(
  setSession: React.Dispatch<React.SetStateAction<SessionValue>>,
  queryClient: QueryClient,
) {
  try {
    const csrf = await getCsrf(queryClient);
    const domain = queryClient.getQueryData<DomainInfo>(['domain']);
    if (!domain) throw new Error('No domain set');
    const credentials = {
      csrfToken: csrf,
      callbackUrl: 'http://localhost/home',
      json: true,
    };
    const formBody: string[] = [];
    for (let property in credentials) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(
        credentials[property as keyof typeof credentials],
      );
      formBody.push(encodedKey + '=' + encodedValue);
    }
    const cookies = (await AsyncStorage.getItem('cookie')) ?? '';
    await fetchAllowLocal(queryClient).fetch(
      'POST',
      `${domain.usedDomain}/api/auth/signout`,
      {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        cookie: cookies,
      },
      formBody.join('&'),
    );
    await AsyncStorage.removeItem('session');
    queryClient.setQueryData(['domain'], domain);
    setSession({data: null, status: 'loggingOut'});
  } catch (error) {
    console.log('Logout failed');
    console.log(error);
  }
}
