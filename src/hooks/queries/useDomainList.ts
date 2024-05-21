import {DomainListItem, DomainListItemSaveData} from 'types';
import {useQuery, useQueryClient, UseQueryOptions} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {shouldUseHttp} from 'validations';
import {useEffect} from 'react';
import axios from 'axios';

export const DOMAIN_LIST_QUERY_KEY = 'DOMAIN_LIST';

/**
 * A React Query {@link https://tanstack.com/query/v4/docs/reference/useQuery useQuery} hook to get the system DNS info.
 * @param options The React Query Options
 * @returns A useQuery hook
 */
export function useDomainList(
  options?: Omit<UseQueryOptions<DomainListItem[]>, 'queryFn' | 'queryKey'>,
) {
  const queryClient = useQueryClient();
  const hook = useQuery<DomainListItem[]>(
    [DOMAIN_LIST_QUERY_KEY],
    async () =>
      (
        JSON.parse(
          (await AsyncStorage.getItem('domains')) ?? '[]',
        ) as DomainListItemSaveData[]
      ).map(item => ({...item, isLoading: true})) as DomainListItem[],
    options,
  );
  useEffect(() => {
    if (!hook.data) return;
    hook.data.forEach(item => {
      setTimeout(() => {
        axios
          .get<{domain: string; deviceName: string}>(
            `${shouldUseHttp(item.domain) ? 'http://' : 'https://'}${
              item.domain
            }/api/domain`,
            {timeout: 5000},
          )
          .then(res => {
            console.log(item.deviceName, item.domain, res.status);
            if (res.status < 200) throw new Error('Invalid domain');
            item.isLoading = false;
            item.deviceName = res.data.deviceName;
            queryClient.setQueryData<DomainListItem[]>(
              [DOMAIN_LIST_QUERY_KEY],
              prevData => {
                const newData = prevData?.map(prevItem =>
                  prevItem.domain === item.domain
                    ? {
                        ...prevItem,
                        isLoading: false,
                        deviceName: res.data.deviceName,
                      }
                    : prevItem,
                );
                return newData;
              },
            );
          })
          .catch(err => {
            console.log('CAUGHT ERROR', item.domain, err.toString());
            queryClient.setQueryData<DomainListItem[]>(
              [DOMAIN_LIST_QUERY_KEY],
              prevData =>
                prevData?.map(prevItem =>
                  prevItem.domain === item.domain
                    ? {
                        ...prevItem,
                        isLoading: false,
                        isError: true,
                      }
                    : prevItem,
                ),
            );
          });
      }, 0);
    });
  }, [hook.data, queryClient]);
  return hook;
}
