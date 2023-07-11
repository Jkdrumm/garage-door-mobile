import {useContext, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {PaperProvider} from 'react-native-paper';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {Home as HomeIcon} from 'react-native-feather';
import {AddSystem, Home, Login, SystemsDashboard} from 'pages';
import {
  HeaderLeft,
  HeaderRight,
  SessionProvider,
  ThemeContext,
  ThemeProvider,
  WebSocketProvider,
} from 'components';
import {
  DarkNavigationTheme,
  DarkPaperTheme,
  LightNavigationTheme,
  LightPaperTheme,
} from 'themes';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AppWithTheme() {
  const [queryClient] = useState(() => new QueryClient());
  const {theme} = useContext(ThemeContext);

  const [navigationTheme, paperTheme] =
    theme === 'light'
      ? [LightNavigationTheme, LightPaperTheme]
      : [DarkNavigationTheme, DarkPaperTheme];

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={navigationTheme}>
          <PaperProvider theme={paperTheme}>
            <Stack.Navigator
              screenOptions={{headerShown: false}}
              initialRouteName="SystemsDashboard">
              <Stack.Screen
                name="SystemsDashboard"
                component={SystemsDashboard}
              />
              <Stack.Screen name="AddSystem" component={AddSystem} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Drawer" component={DrawerNavigation} />
            </Stack.Navigator>
          </PaperProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </SessionProvider>
  );
}

function DrawerNavigation() {
  return (
    <WebSocketProvider>
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerRight: () => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
          // title: 'Garage Door 3.0',
        })}>
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{
            drawerIcon: ({color, size}) => (
              <HomeIcon color={color} fontSize={size} />
            ),
          }}
        />
      </Drawer.Navigator>
    </WebSocketProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}

export default App;
