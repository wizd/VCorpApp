import React, { useEffect, useState } from 'react';
import RNLocalize from 'react-native-localize';
import translations from './src/i18n/translations';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from './src/screens/Onboarding';
import ChatPage from './src/screens/ChatPage';
import ShortCuts from './src/screens/ShortCuts';
import EmployeeList from './src/screens/EmployeeList';
import EmployeeMarket from './src/screens/EmployeeMarket';
import { AppContextProvider } from './src/persist/AppContext';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppSettings from './src/screens/AppSettings';

const Stack = createStackNavigator();

const App = () => {
  const [hideSplashScreen, _setHideSplashScreen] = useState(true);
  const [appName, setAppName] = useState('VCorp');

  useEffect(() => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
    if (translations.hasOwnProperty(deviceLanguage)) {
      setAppName(translations[deviceLanguage].appName);
    }
  }, []);

  return (
    <>
      <AppContextProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            {hideSplashScreen ? (
              <Stack.Navigator
                initialRouteName="Onboarding"
                screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="Onboarding"
                  component={Onboarding}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ChatPage"
                  component={ChatPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ShortCuts"
                  component={ShortCuts}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Employees"
                  component={EmployeeList}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="EmployeeMarket"
                  component={EmployeeMarket}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Settings"
                  component={AppSettings}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            ) : null}
          </NavigationContainer>
          <Toast />
        </SafeAreaProvider>
      </AppContextProvider>
    </>
  );
};

export default App;
