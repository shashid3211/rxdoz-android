import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {theme} from '../Constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  AddAppointment,
  AddPrescribeDetail,
  AddPrescription,
  AddProfessional,
  Home,
  Report,
  Support,
  Treatment,
  ViewDosage,
  ViewMedicines,
} from '../Screens';
import {Image, Text, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Components/Header';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeDrawer({navigation, route}) {
  const [person, setPerson] = useState(null);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('name');

      if (value !== null) {
        // value previously stored
        console.log('----' + value);
        setPerson(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: theme.COLORS.darkBlue_gradient2,
        headerTitle: props => {
          return (
            <View>
              <Image
                source={require('../Assets/logo.jpg')}
                style={{width: 40, height: 40}}
                resizeMode="contain"></Image>
              {/* <Text>Hello, {person}</Text> */}
            </View>
          );
        },
      }}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}

const HomeNavigator = () => {
  const [person, setPerson] = useState(null);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('image');

      if (value !== null) {
        // value previously stored
        console.log('----' + value);
        setPerson(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={({navigation}) => ({
        headerStyle: {
          backgroundColor: theme.COLORS.white,
        },
      })}>
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={({navigation}) => ({
          headerBackVisible: false,
          headerTitle: () => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '98%',
                padding: 8,
              }}>
              <Image
                source={require('../Assets/logo.jpg')}
                style={{width: 50, height: 50}}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('UserSchedule')}>
                <Image
                  source={
                    person ? {uri: person} : require('../Assets/profile.jpg')
                  }
                  style={{width: 50, height: 50, borderRadius: 25}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="ViewDosage"
        component={ViewDosage}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

const TreatmentNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="TreatmentScreen"
      screenOptions={({navigation}) => ({
        headerStyle: {
          backgroundColor: theme.COLORS.white,
        },
      })}>
      <Stack.Screen
        name="TreatmentScreen"
        component={Treatment}
        options={({navigation}) => ({
          headerBackVisible: false,
          headerTitle: () => <Header title="Prescription" />,
        })}
      />
      <Stack.Screen
        name="ViewMedicines"
        component={ViewMedicines}
        options={({navigation}) => ({
          headerBackVisible: false,
          headerTitle: () => <Header title="Medicines" />,
        })}
      />
      <Stack.Screen
        name="AddPrescription"
        component={AddPrescription}
        options={({navigation}) => ({
          headerBackVisible: false,
          headerTitle: () => <Header title="Add Prescription" />,
        })}
      />
      <Stack.Screen
        name="AddPrescribeDetail"
        component={AddPrescribeDetail}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

const ReportNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReportScreen"
      screenOptions={({navigation}) => ({
        headerStyle: {
          backgroundColor: theme.COLORS.white,
        },
      })}>
      <Stack.Screen
        name="ReportScreen"
        component={Report}
        options={({navigation}) => ({
          headerBackVisible: false,
          headerTitle: () => <Header title="Report" />,
        })}
      />
    </Stack.Navigator>
  );
};

const SupportNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SupportScreen"
      screenOptions={({navigation}) => ({
        headerStyle: {
          backgroundColor: theme.COLORS.white,
        },
      })}>
      <Stack.Screen
        name="SupportScreen"
        component={Support}
        options={({navigation}) => ({
          headerTitle: props => <Text>Progress</Text>,
        })}
      />
      <Stack.Screen
        name="AddAppointment"
        component={AddAppointment}
        options={({navigation}) => ({headerShown: false})}
      />
      <Stack.Screen
        name="AddProfessional"
        component={AddProfessional}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

export {HomeNavigator, TreatmentNavigator, SupportNavigator, ReportNavigator};
