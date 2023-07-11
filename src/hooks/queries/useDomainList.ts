import {DomainListItem} from 'types';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DOMAIN_LIST_QUERY_KEY = 'DOMAIN_LIST';

/**
 * A React Query {@link https://tanstack.com/query/v4/docs/reference/useQuery useQuery} hook to get the system DNS info.
 * @param options The React Query Options
 * @returns A useQuery hook
 */
export function useDomainList(
  options?: Omit<UseQueryOptions<DomainListItem[]>, 'queryFn' | 'queryKey'>,
) {
  return useQuery<DomainListItem[]>(
    [DOMAIN_LIST_QUERY_KEY],
    async () =>
      JSON.parse(
        (await AsyncStorage.getItem('domains')) ?? '[]',
      ) as DomainListItem[],
    options,
  );
}
