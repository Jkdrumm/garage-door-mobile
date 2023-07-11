import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {DOMAIN_LIST_QUERY_KEY} from 'hooks';
import {DomainListItem} from 'types';

export const DELETE_DOMAIN_QUERY_KEY = 'DELETE_DOMAIN';

/**
 * A React Query {@link https://tanstack.com/query/v4/docs/react/reference/useMutation useMutation} hook to press the garage door button.
 * @param options The React Query Options
 * @returns A useMutation hook
 */
export function useDeleteDomain(
  options?: Omit<
    UseMutationOptions<void, void, string>,
    'mutationFn' | 'mutationKey'
  >,
) {
  const queryClient = useQueryClient();
  return useMutation<void, void, string>(
    [DELETE_DOMAIN_QUERY_KEY],
    async (domain: string) => {
      const domains: DomainListItem[] =
        queryClient.getQueryData<DomainListItem[]>([DOMAIN_LIST_QUERY_KEY]) ??
        JSON.parse((await AsyncStorage.getItem('domains')) ?? '[]');
      // Delete the item from the list
      const newDomains = domains.filter(listItem => domain !== listItem.domain);
      // Save the new list to async storage
      await AsyncStorage.setItem('domains', JSON.stringify(newDomains));
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.setQueryData<DomainListItem[]>(
          [DOMAIN_LIST_QUERY_KEY],
          prevData => {
            if (!prevData) return undefined;
            return prevData.filter(listItem => variables !== listItem.domain);
          },
        );
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
}
