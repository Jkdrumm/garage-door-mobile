import {useContext} from 'react';
import {ThemeContext} from 'components';

export function useColorModeValue(light: any, dark: any) {
  const {theme} = useContext(ThemeContext);
  return theme === 'light' ? light : dark;
}
