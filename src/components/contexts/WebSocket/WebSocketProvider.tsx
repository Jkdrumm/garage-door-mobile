import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {io} from 'socket.io-client';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {fetchAllowLocal, signOut, useSession} from 'auth';
import {WebSocketContext} from '.';
import {addEventListeners} from './listeners';
import {ClientSocket, DomainInfo, RootStackParamList} from 'types';
import {GARAGE_STATE_QUERY_KEY} from 'hooks';
import {GarageState} from 'enums';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SessionContext} from '../Session';

type EmitParams = Parameters<ClientSocket['emit' | 'emitWithAck']>;

export function WebSocketProvider({children}: PropsWithChildren) {
  const webSocket = useRef<ClientSocket>();
  const queryClient = useQueryClient();
  const {status} = useSession();
  const onConnectEvents = useRef<
    {event: EmitParams; resolve?: (value: any) => void}[]
  >([]);
  const {setSession} = useContext(SessionContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const sendMessage = useCallback(
    (...event: Parameters<ClientSocket['emit']>) => {
      if (webSocket.current?.connected)
        webSocket.current.emit.apply(webSocket.current, event);
      else onConnectEvents.current.push({event});
    },
    [],
  ) as ClientSocket['emit'];

  const sendMessagePromise = useCallback(
    (...event: Parameters<ClientSocket['emitWithAck']>) => {
      if (webSocket.current?.connected)
        return webSocket.current.emitWithAck.apply(webSocket.current, event);
      return new Promise(resolve => {
        onConnectEvents.current.push({event, resolve});
      });
    },
    [],
  ) as ClientSocket['emitWithAck'];

  const pressButton = useCallback(() => {
    sendMessage('PRESS');
  }, [sendMessage]);

  const {mutate: connectWebsocket} = useMutation(
    ['socket'],
    async () => {
      const domain = queryClient.getQueryData<DomainInfo>(['domain']);
      if (!domain?.usedDomain) throw new Error('No domain found');
      const cookie = await AsyncStorage.getItem('cookie');
      const cookies = `token=${await AsyncStorage.getItem('csrf')}; ${cookie}`;
      await fetchAllowLocal(queryClient).fetch(
        'POST',
        `${
          // @TODO: Build my own library to allow for ignoring SSL errors
          // If the domain is trusted, remove the https://
          domain.isTrusted
            ? `http://${domain.usedDomain.substring(8)}`
            : `${domain.usedDomain}`
        }/api/socket`,
        {
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
          cookie: cookies,
          host: 'http://localhost',
        },
      );
    },
    {
      onSuccess: () => {
        socketInitializer();
      },
    },
  );

  useEffect(() => {
    if (status === 'authenticated') connectWebsocket();
    else if (status === 'loading') {
      AsyncStorage.getItem('session').then(session => {
        if (session) {
          setSession(JSON.parse(session));
          connectWebsocket();
        } else {
          navigation.navigate('Login');
        }
      });
    }
    return () => {
      webSocket?.current?.removeAllListeners();
      webSocket?.current?.disconnect();
    };
  }, [connectWebsocket, navigation, setSession, status]);

  const disconnectWebsocket = useCallback(async () => {
    webSocket?.current?.removeAllListeners();
    webSocket?.current?.disconnect();
    await signOut(setSession, queryClient);
    navigation.navigate('Login');
  }, [navigation, queryClient, setSession]);

  const socketInitializer = useCallback(() => {
    const domain = queryClient.getQueryData<DomainInfo>(['domain']);
    if (!domain?.usedDomain) throw new Error('No domain found');
    const socket: ClientSocket = io(
      // @TODO: Build my own library to allow for ignoring SSL errors
      // If the domain is trusted, remove the https://
      domain.isTrusted
        ? `http://${domain.usedDomain.substring(8)}`
        : `${domain.usedDomain}`,
      {
        rejectUnauthorized: false,
      },
    );
    socket.on('connect_error', error => {
      console.log(error.message);
    });
    socket.on('connect', () => {
      addEventListeners(socket, queryClient);

      onConnectEvents.current.forEach(({event, resolve}) => {
        if (resolve)
          resolve(
            webSocket.current?.emitWithAck.apply(
              webSocket.current,
              event as Parameters<ClientSocket['emitWithAck']>,
            ),
          );
        else
          webSocket.current?.emit.apply(
            webSocket.current,
            event as Parameters<ClientSocket['emit']>,
          );
      });
      onConnectEvents.current = [];
    });

    socket.on('disconnect', () => {
      // Set the garage state to fetching
      queryClient.setQueryData<GarageState>(
        [GARAGE_STATE_QUERY_KEY],
        () => GarageState.FETCHING,
      );
      setTimeout(socketInitializer, 10000);
    });

    webSocket.current = socket;
  }, [queryClient]);

  const providerValue = useMemo(
    () => ({
      isWebsocketConnected: webSocket.current?.connected ?? false,
      sendMessage,
      sendMessagePromise,
      disconnectWebsocket,
      pressButton,
    }),
    [sendMessage, sendMessagePromise, disconnectWebsocket, pressButton],
  );

  return (
    <WebSocketContext.Provider value={providerValue}>
      {children}
    </WebSocketContext.Provider>
  );
}
