import {PropsWithChildren, useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Moon, Sun} from 'react-native-feather';
import {useColorModeValue} from 'hooks';
import {ThemeContext} from '../contexts';
import {colors} from 'colors';

export type CenterBoxProps = PropsWithChildren<{
  title: string;
}>;

/**
 * A centered box for displaying the main page content.
 */
export function CenterBox({title, children}: CenterBoxProps) {
  const {toggleTheme} = useContext(ThemeContext);
  const themeIcon = useColorModeValue(
    <Moon color="black" fill="black" height={20} />,
    <Sun color="white" height={20} />,
  );
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: useColorModeValue('white', colors.gray[700])},
      ]}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: useColorModeValue(
              colors.gray[200],
              colors.gray[600],
            ),
          },
        ]}>
        <View style={styles.spacer} />
        <Text
          style={[styles.title, {color: useColorModeValue('black', 'white')}]}>
          {title}
        </Text>
        <TouchableOpacity
          style={[
            styles.colorModeButton,
            {
              backgroundColor: useColorModeValue(
                colors.gray[200],
                colors.whiteAlpha[200],
              ),
            },
          ]}
          onPress={() => toggleTheme()}>
          {themeIcon}
        </TouchableOpacity>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 20,
    shadow: '0px 0px 32px 0px #4E4E4E2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    color: 'black',
    flex: 1,
  },
  colorModeButton: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  spacer: {
    width: 48,
  },
  contentWrapper: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});
