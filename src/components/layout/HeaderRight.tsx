import {Avatar, Divider, Menu} from 'react-native-paper';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useColorModeValue, useUser, useUserLevel} from 'hooks';
import {useContext, useState} from 'react';
import {LogOut, Moon, Sun, User} from 'react-native-feather';
import {signOut} from 'auth';
import {SessionContext, ThemeContext} from 'components';
import {DrawerNavigationProp} from 'types';
import {useQueryClient} from '@tanstack/react-query';
import {colors} from 'colors';

export function HeaderRight({navigation}: DrawerNavigationProp<'Header'>) {
  const {data: user, isLoading} = useUser();
  console.log(user, isLoading);
  const {data: userLevel} = useUserLevel();

  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const {setSession} = useContext(SessionContext);
  const {toggleTheme} = useContext(ThemeContext);

  const queryClient = useQueryClient();

  const themeIcon = useColorModeValue(MoonIcon, SunIcon);
  const themeText = useColorModeValue('Dark Mode', 'Light Mode');
  const textColor = useColorModeValue('black', 'white');

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu} style={styles.button}>
          <Avatar.Text
            size={36}
            label={user ? `${user.firstName[0]}${user.lastName[0]}` : '??'}
            style={{
              backgroundColor:
                colors[
                  ['blue', 'green', 'yellow', 'red'][
                    userLevel ?? 0
                  ] as keyof typeof colors
                ][500],
            }}
          />
        </TouchableOpacity>
      }>
      <Menu.Item
        onPress={() => {}}
        title="Profile"
        leadingIcon={UserIcon(textColor)}
      />
      <Menu.Item
        onPress={() => toggleTheme().then(closeMenu)}
        title={themeText}
        leadingIcon={themeIcon}
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          signOut(setSession, queryClient).then(() => {
            closeMenu();
            navigation.navigate('Login');
          });
        }}
        title="Sign Out"
        leadingIcon={LogOutIcon(textColor)}
      />
    </Menu>
  );
}

function UserIcon(color: string) {
  return () => <User color={color} />;
}

function MoonIcon() {
  return <Moon color="black" fill="black" />;
}

function SunIcon() {
  return <Sun color="white" />;
}

function LogOutIcon(color: string) {
  return () => <LogOut color={color} />;
}

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
  },
});
