module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    ['@babel/preset-react', {runtime: 'automatic'}],
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          auth: './src/auth',
          colors: './src/colors',
          components: './src/components',
          enums: './src/enums',
          hooks: './src/hooks',
          pages: './src/pages',
          themes: './src/themes',
          types: './src/types',
          validations: './src/validations',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
