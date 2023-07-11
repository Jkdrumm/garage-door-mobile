import {DrawerNavigationProp as DefaultDrawerNavigationProp} from '@react-navigation/drawer';
import {StackNavigationProp as DefaultStackNavigationProp} from '@react-navigation/stack';

export type DrawerNavigationProp<T extends keyof RootDrawerParamList> = {
  navigation: DefaultDrawerNavigationProp<RootDrawerParamList, T>;
};

export type RootDrawerParamList = {
  Home: undefined;
  Login: undefined;
  Header: undefined;
};

export type StackNavigationProp<T extends keyof RootStackParamList> = {
  navigation: DefaultStackNavigationProp<RootStackParamList, T>;
};

export type RootStackParamList = {
  SystemsDashboard: undefined;
  AddSystem: undefined;
  ConnectSystem: {type: 'wifi' | 'bluetooth' | 'manual'; domainName: string};
  Drawer: undefined;
  Login: undefined;
};
