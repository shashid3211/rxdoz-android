import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../Constants/theme';
import {
  HomeNavigator,
  ReportNavigator,
  SupportNavigator,
  TreatmentNavigator,
} from './StackNavigator';
import {Image} from 'react-native';
import {useTranslation} from 'react-i18next';

const Tab = createMaterialBottomTabNavigator();

function BottomTabsNavigator() {
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      activeColor={theme.COLORS.darkBlue_gradient2}
      inactiveColor={theme.COLORS.darkBlue_gradient1}
      activeIndicatorStyle={{backgroundColor: theme.COLORS.white}}
      barStyle={{
        backgroundColor: theme.COLORS.white,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({color, focused}) => (
            // <Image
            //   source={
            //     focuseds
            //       ? require('../Assets/tab1.png')
            //       : require('../Assets/tab1o.png')
            //   }
            //   style={{height: 30, width: 30}}
            // />
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="TreatmentTab"
        component={TreatmentNavigator}
        options={{
          tabBarLabel: t('prescriptions'),
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="clipboard-text"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ReportTab"
        component={ReportNavigator}
        options={{
          tabBarLabel: t('reports'),
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="clipboard-plus-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="SupportTab"
        component={SupportNavigator}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="chart-box-plus-outline"
              color={color}
              size={25}
            />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

export {BottomTabsNavigator};
