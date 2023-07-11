import {View, FlatList, StyleSheet} from 'react-native';
import {getIpAddressesForHostname} from 'react-native-dns-lookup';
import NetInfo from '@react-native-community/netinfo';
import {FAB} from 'react-native-paper';
import {Plus} from 'react-native-feather';
import {useQueryClient} from '@tanstack/react-query';
import {colors} from 'colors';
import {DomainInfo, DomainListItem, StackNavigationProp} from 'types';
import {shouldUseHttp, validateIpAddress} from 'validations';
import {SwipeableListItem} from 'components';
import {useDeleteDomain, useDomainList} from 'hooks';
import axios from 'axios';
import {validateSslDomain} from 'auth';

export function SystemsDashboard({
  navigation,
}: StackNavigationProp<'SystemsDashboard'>) {
  const queryClient = useQueryClient();

  const {data: domains} = useDomainList();
  const {mutate: deleteDomain} = useDeleteDomain();

  // Function to handle the system item click
  const handleItemClick = async ({domain}: DomainListItem) => {
    let usedDomain = domain;
    // Only run if running on wifi and domain is a hostname
    if (!validateIpAddress(domain) && (await NetInfo.fetch()).type === 'wifi') {
      const currentPublicIp = (
        await axios.get<{ip: string}>('https://api.ipify.org/?format=json')
      ).data.ip;
      const ipAddresses = await getIpAddressesForHostname(domain);
      console.log(
        currentPublicIp,
        ipAddresses,
        ipAddresses.includes(currentPublicIp),
      );
      if (ipAddresses.includes(currentPublicIp)) usedDomain = 'garage.local';
    }
    console.log(domain, usedDomain);
    usedDomain = `${
      shouldUseHttp(domain) ? 'http://' : 'https://'
    }${usedDomain}`;
    queryClient.setQueryData<DomainInfo>(['domain'], {
      domain,
      usedDomain,
      isTrusted: false,
    });
    console.log('DOMAIN', domain, usedDomain);
    if (usedDomain === 'https://garage.local')
      validateSslDomain(domain, usedDomain);
    navigation.navigate('Login');
  };

  // Function to handle the Floating Action Button click
  function handleFABClick() {
    navigation.navigate('AddSystem');
  }

  // Renders the system item
  const renderSystemItem = ({item}: {item: DomainListItem}) => (
    <SwipeableListItem
      item={item}
      onPress={() => handleItemClick(item)}
      onDelete={() => deleteDomain(item.domain)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={domains ?? []}
        keyExtractor={item => item.domain}
        renderItem={renderSystemItem}
      />
      <FAB style={styles.fab} icon={PlusIcon} onPress={handleFABClick} />
    </View>
  );
}

function PlusIcon() {
  return <Plus color="white" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    backgroundColor: colors.purple[700],
    margin: 24,
    right: 0,
    bottom: 0,
  },
});
