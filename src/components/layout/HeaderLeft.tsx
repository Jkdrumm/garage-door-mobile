import {StyleSheet, TouchableOpacity} from 'react-native';
import {Menu} from 'react-native-feather';
import {DrawerNavigationProp} from 'types';
import {useColorModeValue} from 'hooks';
import {colors} from 'colors';

export function HeaderLeft({navigation}: DrawerNavigationProp<'Header'>) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: useColorModeValue(
            colors.gray[200],
            colors.whiteAlpha[300],
          ),
        },
      ]}>
      <Menu
        onPress={() => navigation.openDrawer()}
        height={20}
        color={useColorModeValue(colors.gray[500], colors.whiteAlpha[900])}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    marginLeft: 16,
    padding: 8,
    borderRadius: 6,
  },
});
