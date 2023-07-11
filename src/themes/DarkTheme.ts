import type {Theme} from '@react-navigation/native';
import type {ThemeProp} from 'react-native-paper/lib/typescript/src/types';
import {colors} from 'colors';

export const DarkNavigationTheme: Theme = {
  dark: true,
  colors: {
    primary: colors.purple[500],
    background: colors.gray[900],
    card: 'rgb(18, 18, 18)',
    text: 'white',
    border: colors.gray[800],
    notification: 'rgb(255, 69, 0)',
  },
};

export const DarkPaperTheme: ThemeProp = {
  dark: true,
  isV3: true,
  colors: {
    onSurface: 'white',
    elevation: {
      level2: colors.gray[700],
    },
  },
};
