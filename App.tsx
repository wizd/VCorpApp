/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
const Stack = createNativeStackNavigator();
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PersistGate} from 'redux-persist/integration/react';
import Onboarding from './src/screens/Onboarding';
import ChatPage from './src/screens/ChatPage';
import ShortCuts from './src/screens/ShortCuts';
import EmployeeList from './src/screens/EmployeeList';
import EmployeeMarket from './src/screens/EmployeeMarket';
import Toast from 'react-native-toast-message';
import AppSettings from './src/screens/AppSettings';

import {persistor, store} from './src/persist/Store';

const App = () => {
  const [hideSplashScreen, _setHideSplashScreen] = React.useState(true);
  //const [appName, setAppName] = useState('VCorp');

  useEffect(() => {
    //const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
    // if (translations.hasOwnProperty(deviceLanguage)) {
    //   setAppName(translations[deviceLanguage].appName);
    // }
  }, []);
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            {hideSplashScreen ? (
              <Stack.Navigator
                initialRouteName="Onboarding"
                screenOptions={{headerShown: false}}>
                <Stack.Screen
                  name="Onboarding"
                  component={Onboarding}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="ChatPage"
                  component={ChatPage}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="ShortCuts"
                  component={ShortCuts}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Employees"
                  component={EmployeeList}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="EmployeeMarket"
                  component={EmployeeMarket}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Settings"
                  component={AppSettings}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
            ) : null}
          </NavigationContainer>
          <Toast />
        </PersistGate>
      </Provider>
    </>
  );
};
export default App;

/*type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // useEffect(() => {
  //   const wallet = LyraCrypto.GenerateWallet();
  //   console.log('your private key is: ', wallet.privateKey);
  // }, []);

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
*/
