import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {BottomTabsNavigator} from './App/Navigation/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {theme} from './App/Constants/theme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Landing, Permission, UserSchedule} from './App/Screens';

import notifyBasedOnSchedule from './App/Services/NotificationService';
import * as RNLocalize from 'react-native-localize';
import i18n from './App/utils/i18n';
import {useTranslation} from 'react-i18next';

const Stack = createNativeStackNavigator();
function App() {
  const {t} = useTranslation();
  // const date = m;
  useEffect(() => {
    const initApp = async () => {
      console.log('Initial App');
      // notifyBasedOnSchedule(t);
    };

    initApp();
    // console.log(getDosage());
    console.log('App');
  }, [t]);

  useEffect(() => {
    // Set the initial language based on device locale
    const locale = RNLocalize.getLocales()[0].languageCode;
    i18n.changeLanguage(locale);
  }, []);

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#ffffff"
        translucent={true}
      />
      <View style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={({navigation}) => ({
              headerStyle: {
                backgroundColor: theme.COLORS.white,
              },
            })}>
            <Stack.Screen
              name="Landing"
              component={Landing}
              options={({navigation}) => ({headerShown: false})}
            />
            <Stack.Screen
              name="Permission"
              component={Permission}
              options={({navigation}) => ({headerShown: false})}
            />
            <Stack.Screen
              name="UserSchedule"
              component={UserSchedule}
              options={({navigation}) => ({headerShown: false})}
            />
            <Stack.Screen
              name="MainTab"
              component={BottomTabsNavigator}
              options={({navigation}) => ({headerShown: false})}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});

export default App;
