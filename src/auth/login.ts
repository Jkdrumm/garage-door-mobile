import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCsrf, getSession, postCredentials} from './util';
import {SessionValue} from 'components';
import {QueryClient} from '@tanstack/react-query';

export async function login(
  {
    username,
    password,
  }: {
    username: string;
    password: string;
  },
  setSession: React.Dispatch<React.SetStateAction<SessionValue>>,
  queryClient: QueryClient,
) {
  setSession({data: null, status: 'loading'});
  const csrf = await getCsrf(queryClient);
  await AsyncStorage.setItem('csrf', csrf);
  await postCredentials(
    {
      csrfToken: csrf,
      username,
      password,
      redirect: false,
      callbackUrl: 'http://localhost/',
      json: true,
    },
    queryClient,
  );
  const data = await getSession(csrf, queryClient);
  setSession({data: data.json(), status: 'authenticated'});
  await AsyncStorage.setItem('session', JSON.stringify(data.json()));
  const cookies = data.respInfo.headers['set-cookie']?.[0];
  if (cookies) await AsyncStorage.setItem('cookie', cookies);
}
