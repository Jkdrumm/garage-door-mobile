export type DomainListItem = DomainListItemSaveData & {
  isLoading?: boolean;
  isError?: boolean;
};

export type DomainListItemSaveData = {
  domain: string;
  deviceName: string;
};
