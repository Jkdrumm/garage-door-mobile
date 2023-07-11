import {useState} from 'react';
import axios from 'axios';
import {View, StyleSheet, TextInput} from 'react-native';
import {Text, Button, Title} from 'react-native-paper';
import {StackNavigationProp} from 'types';
import {PrimaryButton} from 'components';
import {colors} from 'colors';
import {useAddDomain, useColorModeValue} from 'hooks';
import {shouldUseHttp, validateHostname, validateIpAddress} from 'validations';

type RadioButtonValue = 'wifi' | 'manual';

export function AddSystem({navigation}: StackNavigationProp<'AddSystem'>) {
  const [radio, setRadio] = useState<RadioButtonValue>('wifi');
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [domainError, setDomainError] = useState('');
  const {mutateAsync: addDomain} = useAddDomain();

  const textColor = useColorModeValue('black', 'white');

  function validateDomain(value: string) {
    if (value.length === 0) return setDomainError('Domain is required');
    if (!validateHostname(value) && !validateIpAddress(value))
      return setDomainError('Invalid domain name');
    setDomainError('');
  }

  async function handleNextClick() {
    setIsLoading(true);
    const url =
      radio === 'manual'
        ? `${
            shouldUseHttp(domain) ? 'http://' : 'https://'
          }${domain}/api/domain`
        : 'http://garage.local/api/domain';
    const result = await axios.post<{domain: string; deviceName: string}>(url);
    setIsLoading(false);
    // Ensure the necessary data is present
    const {domain: domainFromDevice, deviceName: deviceNameFromDevice} =
      result.data;
    if (!domainFromDevice || !deviceNameFromDevice) return;
    if (result.status === 200) {
      const newDomain = {
        domain:
          // In development, use the domain the user entered
          process.env.NODE_ENV === 'development' && radio === 'manual'
            ? domain
            : domainFromDevice,
        deviceName: deviceNameFromDevice,
      };
      await addDomain(newDomain);
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Add new device</Title>
      <View style={styles.radioButtonGroup}>
        <View
          style={[
            styles.radioButtonWrapper,
            radio === 'wifi' ? styles.borderGreen : styles.borderAlpha,
          ]}>
          <Button
            buttonColor={colors.green[500]}
            contentStyle={styles.radioButton}
            onPress={() => setRadio('wifi')}>
            <Text style={styles.buttonText}>On your Wifi network</Text>
          </Button>
        </View>
        <View
          style={[
            styles.radioButtonWrapper,
            radio === 'manual' ? styles.borderRed : styles.borderAlpha,
          ]}>
          <Button
            buttonColor={colors.red[500]}
            contentStyle={styles.radioButton}
            onPress={() => setRadio('manual')}>
            <Text style={styles.buttonText}>Manual Setup</Text>
          </Button>
        </View>
      </View>
      {radio === 'manual' && (
        <>
          <Text style={{color: textColor}}>
            Domain Name (e.g. examplegarage.com)
          </Text>
          <TextInput
            value={domain}
            onChangeText={value => {
              setDomain(value);
              validateDomain(value);
            }}
            placeholderTextColor={colors.gray[600]}
            style={[styles.input, {color: textColor}]}
          />
          {domainError.length > 0 && (
            <Text style={{color: colors.red[500]}}>{domainError}</Text>
          )}
        </>
      )}
      <PrimaryButton
        onPress={handleNextClick}
        label="Next"
        disabled={radio === 'manual' && domain.length === 0}
        loading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  radioButtonGroup: {
    gap: 24,
    marginBottom: 16,
  },
  radioButton: {
    height: 64,
  },
  radioButtonWrapper: {
    margin: -6,
    padding: 6,
    borderWidth: 2,
    borderRadius: 30,
  },
  buttonText: {fontSize: 32, paddingTop: 16},
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  borderAlpha: {
    borderColor: 'rgba(0,0,0,0)',
  },
  borderRed: {
    borderColor: colors.red[500],
  },
  borderGreen: {
    borderColor: colors.green[500],
  },
});
