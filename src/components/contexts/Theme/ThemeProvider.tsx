import {
  useState,
  useEffect,
  PropsWithChildren,
  useMemo,
  useCallback,
} from 'react';
import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from './ThemeContext';

export function ThemeProvider({children}: PropsWithChildren) {
  const [theme, setTheme] = useState(Appearance.getColorScheme() ?? 'light');

  useEffect(() => {
    (async () => {
      const savedTheme = (await AsyncStorage.getItem('theme')) as
        | 'light'
        | 'dark'
        | null;
      setTheme(savedTheme ?? Appearance.getColorScheme() ?? 'light');
    })();

    const subscription = Appearance.addChangeListener(({colorScheme}) =>
      setTheme(colorScheme ?? 'light'),
    );

    return () => subscription.remove();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  }, [theme]);

  const values = useMemo(() => ({theme, toggleTheme}), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
}
