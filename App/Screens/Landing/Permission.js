import {
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme} from '../../Constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import {Divider} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const Permission = ({navigation}) => {
  const {t} = useTranslation();
  const [detailed, setDetailed] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('schedule');
      const getName = await AsyncStorage.getItem('name');
      if (getName != null && jsonValue != null) {
        setDetailed(true);
      }
    } catch (e) {
      // error reading value
    }
  };

  // const requestNotificationPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //         {
  //           title: 'Notification Permission',
  //           message:
  //             'App needs access to your notification ' +
  //             'so you can get Updates',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       console.log(granted);
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         navigation.navigate('UserSchedule');
  //       } else {
  //         console.log('permission denied');
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // };

  // const checkNotificationPermission = async () => {
  //   const result = await PermissionsAndroid.check(
  //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //   );
  //   return result;
  // };
  const checkNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      // For Android versions below 13, assume permission is granted
      if (Platform.Version < 33) {
        return true;
      }
      try {
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        return result;
      } catch (err) {
        console.warn('Error checking notification permission:', err);
        return false;
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version < 33) {
        // No need to request permission below Android 13
        navigation.navigate('UserSchedule');
        return;
      }
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'The app needs access to your notifications ' +
              'so you can get updates.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Permission result:', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          navigation.navigate('UserSchedule');
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Notification Permission',
            'You have previously denied notification permission. Please enable it manually in the app settings.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
          );
        } else {
          console.log('Permission denied');
        }
      } catch (err) {
        console.warn('Error requesting notification permission:', err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <ImageBackground
          source={require('../../Assets/ellipse.jpg')}
          style={styles.bg}>
          <Image
            source={require('../../Assets/notify.jpg')}
            resizeMode="contain"
            style={{
              width: '70%',
              height: '70%',
              alignSelf: 'center',
              marginTop: 73,
            }}
          />
        </ImageBackground>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginVertical: 20,
            padding: 10,
          }}>
          <Text style={styles.title}>{t('getNotified')}</Text>
          <Image
            source={require('../../Assets/notify1.jpg')}
            resizeMode="contain"
            style={{
              width: '10%',
              height: '100%',
            }}
          />
        </View>
        <Text style={styles.subtext}>{t('turnOnNotifications')}</Text>
        <Text style={styles.subtext}>{t('soWeCanRemindYouAtRightTime')}</Text>

        <TouchableOpacity
          onPress={async () => {
            const checkPermission = await checkNotificationPermission();
            console.log(checkPermission);
            if (checkPermission !== PermissionsAndroid.RESULTS.GRANTED) {
              requestNotificationPermission();
            }
          }}>
          <LinearGradient
            colors={[
              theme.COLORS.darkBlue_gradient1,
              theme.COLORS.darkBlue_gradient2,
            ]}
            style={{...styles.button, flexDirection: 'row'}}
            locations={[0, 0.9]}>
            <MaterialCommunityIcons
              name="bell"
              size={20}
              color={theme.COLORS.white}
            />
            <Text style={styles.btnText}>{t('allowNotifications')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (detailed) {
              navigation.navigate('MainTab');
            } else {
              navigation.navigate('UserSchedule');
            }
          }}>
          <Text style={styles.btnText1}>{t('dontAllowIllTakeTheRisks')}</Text>
          <Divider bold={true} style={{backgroundColor: '#E19D9D'}} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Permission;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  bg: {width: '100%', height: 400, justifyContent: 'center'},
  mainView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: theme.COLORS.darkBlue_gradient2,
    fontWeight: '600',
    fontSize: 18,
  },
  subtext: {
    color: theme.COLORS.black,
    fontWeight: '400',
    marginVertical: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    marginTop: 80,
    // justifyContent: 'center',
    alignItems: 'center',
    // alignContent: 'center',
    paddingHorizontal: 25,
    marginVertical: 40,
    borderRadius: 100,
    width: '70%',
    height: 50,
    padding: 5,
    // backgroundColor: theme.COLORS.blue,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 8,
  },
  btnText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  btnText1: {
    color: theme.COLORS.dark_grey,
    // textDecorationLine: 'underline',
    // borderColor: '#E19D9D',
  },
});
