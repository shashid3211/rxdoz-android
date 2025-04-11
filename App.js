import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Alert, StatusBar, View} from 'react-native';
import {BottomTabsNavigator} from './App/Navigation/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {theme} from './App/Constants/theme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Landing, Permission, UserSchedule} from './App/Screens';

import * as RNLocalize from 'react-native-localize';
import i18n from './App/utils/i18n';

import {navigationRef} from './App/Services/NavigationService';
import {
  getAllMedicines,
  getMedicineByScheduleId,
} from './App/Services/DatabaseService';

import notifee, {AndroidImportance, EventType} from '@notifee/react-native';

const Stack = createNativeStackNavigator();
function App() {
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await getAllMedicines();
        const existingNotifications = await notifee.getTriggerNotifications();
        console.log('Medicine Lists: ', res);
        console.log('Notifications Lists: ', existingNotifications);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    // Set the initial language based on device locale
    const locale = RNLocalize.getLocales()[0].languageCode;
    i18n.changeLanguage(locale);
    // checkBattery();
  }, []);

  const checkBattery = async () => {
    const batteryLevel = await notifee.getBatteryLevel();
    console.log(`Battery level: ${batteryLevel}`);
    const batteryOptimizationEnabled =
      await notifee.isBatteryOptimizationEnabled();
    if (batteryOptimizationEnabled) {
      // 2. ask your users to disable the feature
      Alert.alert(
        'Restrictions Detected',
        'To ensure notifications are delivered, please disable battery optimization for the app.',
        [
          // 3. launch intent to navigate the user to the appropriate screen
          {
            text: 'OK, open settings',
            onPress: async () =>
              await notifee.openBatteryOptimizationSettings(),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#ffffff"
        translucent={true}
      />
      <View style={{flex: 1}}>
        <NavigationContainer ref={navigationRef}>
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

export default App;
