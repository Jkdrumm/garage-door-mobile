import {createContext} from 'react';

export type ThemeContextValue = {
  theme: 'light' | 'dark';
  toggleTheme: () => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => Promise.resolve(),
});
