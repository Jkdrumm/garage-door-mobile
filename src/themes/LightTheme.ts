import type {Theme} from '@react-navigation/native';
import type {ThemeProp} from 'react-native-paper/lib/typescript/src/types';
import {colors} from 'colors';

export const LightNavigationTheme: Theme = {
  dark: false,
  colors: {
    primary: colors.purple[500],
    background: colors.gray[100],
    card: 'rgb(255, 255, 255)',
    text: 'black',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

export const LightPaperTheme: ThemeProp = {
  dark: false,
  isV3: true,
  colors: {
    onSurface: 'black',
    elevation: {
      level2: colors.gray[100],
    },
  },
};
